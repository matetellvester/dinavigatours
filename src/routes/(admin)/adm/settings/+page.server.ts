import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const id = locals.user?.id || (await locals.safeGetSession()).user?.id;

	if (!id) {
		console.error('Admin: Walay user');
	}
	const { data, error } = await locals.supabase
		.from('userlist')
		.select('contactInfos')
		.eq('id', id)
		.single();

	if (error) {
		return {
			contacts: []
		};
	}

	return {
		contacts: data as any
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const id = locals.user?.id || (await locals.safeGetSession()).user?.id;
		const formData = await request.formData();

		if (!formData.get('obj')) {
			return {
				success: false,
				message: `Unable to save, please try again`
			};
		}
		// JSON.parse(formData.get('obj') as string)
		const { error } = await locals.supabase
			.from('userlist')
			.update({ contactInfos: JSON.parse(formData.get('obj') as string) })
			.eq('id', id);

		if (error) {
			console.log(id);

			console.error(error);
			return {
				success: false,
				message: `Unable to save, please try again`
			};
		}

		return { success: true };
	}
};
