import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (locals.role !== 1) {
		redirect(303, '/');
	}
	// if (url.pathname === '/adm') {
	// 	redirect(303, '/adm/users');
	// }
};
