import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ url, locals }) => {
	// if the user is already logged in return them to the account page
	if (locals.user) {
		redirect(303, '/');
	}

	return { url: url.origin };
};
