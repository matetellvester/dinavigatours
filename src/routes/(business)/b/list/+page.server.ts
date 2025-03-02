import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const newDataAdded = cookies.get('userDataAdded');

	if (newDataAdded) {
		cookies.delete('userDataAdded', { path: '/b/list' });
	}

	const { user } = await locals.safeGetSession();

	if (!user) {
		return {
			newDataAdded,
			businessList: [],
			success: false,
			table: 'No user',
			message: `Unable to save, please try again`
		};
	}

	const { data, error } = await locals.supabase
		.from('ltsng_basic_info')
		.select('id, name, category, is_approved, municipality, bgry')
		.eq('user_id', user.id)
		.order('is_approved', { ascending: false, nullsFirst: true });

	if (error) {
		console.error('Error fetching data:', error);
		return { newDataAdded, businessList: [] };
	}

	type Data = {
		id: number;
		name: string;
		category: string;
		is_approved: boolean | null;
		municipality: string;
		bgry: string;
	};

	return {
		newDataAdded,
		businessList: data as Data[]
	};
};
