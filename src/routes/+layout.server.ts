import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	// const { session, user, role } = await safeGetSession();

	return {
		session: locals.session,
		user: locals.user,
		role: locals.role,
		cookies: cookies.getAll()
	};
	// return {
	// 	session,
	// 	user,
	// 	role,
	// 	cookies: cookies.getAll()
	// };
};
