import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ url, locals }) => {
		const id = url.searchParams.get('id');
		const { user } = await locals.safeGetSession();
		console.log(user);

		return {};
	}
};
