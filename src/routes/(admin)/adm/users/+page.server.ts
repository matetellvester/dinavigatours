import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const id = locals.user?.id;

	if (!id) {
		console.error('Admin: Walay user');
	}

	const { data, error } = await locals.supabase.from('userlist').select('*').gt('role', 1);

	if (error) {
		return {
			users: []
		};
	}
	return {
		users: data
	};
};
