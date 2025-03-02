import type { Actions, PageServerLoad } from './$types';
import type { BusinessList } from '$bns-comps';

type BusinessLocation = {
	bgry: string;
	purok: string;
	municipality: string;
};

export const load: PageServerLoad = async ({ locals }) => {
	const id = locals.user?.id;

	if (!id) {
		console.error('Admin: Walay user');
	}

	const { data, error } = await locals.supabase
		.from('ltsng_basic_info')
		.select(
			'id, name, category, is_approved, municipality, bgry, user: userlist(first_name, last_name)'
		)
		.eq('can_book', true)
		.order('is_approved', { ascending: false, nullsFirst: true });

	if (error) {
		console.error('ADMIN list page error: ', error);
		return {
			businessList: []
		};
	}

	// const transformedData: BusinessList[] = data.map((item) => ({
	// 	id: item.id.toString(),
	// 	name: item.name,
	// 	category: item.sub_categ,
	// 	location: item.business_location
	// 		.map((location) => `${location.municipality}, ${location.bgry}, ${location.purok}`)
	// 		.join(', '),
	// 	isApproved: item.isApproved
	// }));

	type Data = {
		id: number;
		name: string;
		category: string;
		is_approved: boolean | null;
		municipality: string;
		bgry: string;
		user: { last_name: string; first_name: string };
	};

	return {
		//@ts-ignore
		businessList: data as Data[]
	};
};

export const actions: Actions = {
	removeBusiness: async ({ request, locals }) => {
		return {
			res: true
		};
	}
};
