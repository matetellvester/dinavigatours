import { AuthApiError } from '@supabase/supabase-js';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals: { safeGetSession }, cookies }) => {
	const { session } = await safeGetSession();

	// if the user is already logged in return them to the account page
	if (session) {
		redirect(303, '/');
	}

	if (cookies.get('email')) {
		redirect(303, '/sign-up/verify');
	}

	return { url: url.origin };
};

export const actions: Actions = {
	default: async (event) => {
		const {
			request,
			cookies,
			locals: { supabase }
		} = event;
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const role = Number(formData.get('role'));
		const first_name = formData.get('firstname') as string;
		const last_name = formData.get('lastname') as string;
		const idNum = formData.get('idNum') as string;
		const idType = formData.get('idType') as string;

		const password = formData.get('password') as string;
		const validEmail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);

		if (!validEmail) {
			return fail(400, { errors: { email: 'Please enter a valid email address' }, email });
		}

		const { error, data } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			return fail(400, {
				success: false,
				email,
				message: `There was an issue, Please contact support.`
			});
		}

		if (data.user) {
			const { error: userErr } = await supabase.from('userlist').insert([
				{
					id: data.user.id,
					role,
					first_name,
					last_name,
					email,
					validId: {
						idNum,
						idType
					}
				}
			]);

			if (userErr) {
				return fail(400, {
					success: false,
					email,
					message: `There was an issue, Please contact support.`
				});
			}
		}

		cookies.set('email', email, {
			path: '/signup',
			httpOnly: true, // Make it HTTP-only for security
			maxAge: 60 * 5 // Expires in 5 minutes
		});

		redirect(303, '/signup/verify');
	}
};
