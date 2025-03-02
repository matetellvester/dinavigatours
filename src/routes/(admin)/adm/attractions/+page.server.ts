import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const id = locals.user?.id;

	if (!id) {
		console.error('Admin: Walay user');
	}
	const { data, error } = await locals.supabase
		.from('ltsng_basic_info')
		.select(
			'id, name, rate, category, branch, municipality, bgry, purok, description, mapLink: map_link'
		)
		.eq('can_book', false);

	if (error) {
		return {
			touristAttractions: []
		};
	}

	return { touristAttractions: data };
};
