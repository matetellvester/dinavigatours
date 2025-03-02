import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, cookies }) => {
	const email = cookies.get('email');
	// cookies.delete('email', { path: '/sign-up' });
	if (locals.user) {
		redirect(303, '/');
	}

	if (!email) {
		redirect(303, '/signup');
	}

	return { email };
};

export const actions: Actions = {
	default: async (event) => {
		const {
			url,
			request,
			cookies,
			locals: { supabase }
		} = event;

		// cookies.delete('email', { path: '/sign-up' });
		// redirect(303, '/sign-up');
		const email = cookies.get('email') as string;

		const token = (await request.formData()).get('token') as string;

		const { error } = await supabase.auth.verifyOtp({
			email,
			token,
			type: 'signup'
		});

		// const { errorw } = await supabase.auth.signInWithOtp()

		if (error) {
			return fail(400, {
				success: false,
				message: `There was an issue, Please contact support.`
			});
		}
		cookies.delete('email', { path: '/sign-up' });

		// redirect(303, '/account-setup');
		redirect(303, '/');

		// return {
		// 	success: true,
		// 	email: '',
		// 	message: 'Please check your email for a verification link to log into the website.'
		// };
	}
};
