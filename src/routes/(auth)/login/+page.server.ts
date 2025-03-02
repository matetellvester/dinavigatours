import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error(error);

			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, { success: false, error: 'Invalid Credentials' });
			}
			return fail(500, { success: false, error: 'Server error try again later' });
		}

		const redirectTo = url.searchParams.get('redirectTo');

		if (redirectTo) {
			throw redirect(303, `/${redirectTo.slice(1)}`);
		}

		throw redirect(303, '/');
	}
};
