import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (locals.role !== 2) {
		redirect(303, '/');
	}

	// if (url.pathname === '/b') {
	// 	redirect(303, '/b/list');
	// }
};
