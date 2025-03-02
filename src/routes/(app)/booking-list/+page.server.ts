import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(302, handleLoginRedirect(url));
	}

	const { data, error } = await locals.supabase
		.from('booking_info')
		.select(
			`
      id,
      created_at,
      user_id,
      booking_date,
      status,
      lstng_id,
      checkin,
      checkout,
      remarks,
      info: ltsng_basic_info (
        name,
        category,
        branch
      ),
      ratings (
      rating
      )
    `
		)
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error(error);
		return {
			bookingList: [],
			currUser: ''
		};
	}

	const transformedData = data.map((item) => ({
		...item,
		ratings: item.ratings.length > 0 ? item.ratings[0].rating : null // Ensure ratings is an object, not an array
	}));

	type BookingDetail = {
		id: number;
		created_at: string;
		booking_date: string;
		checkin: string;
		checkout: string;
		status: BookingStatus;
		lstng_id: number;
		remarks: string | null;
		info: {
			name: string;
			branch: string;
			category: string;
		};
		ratings: null | number;
	};

	// console.log(transformedData);

	const { data: UserData } = await locals.supabase
		.from('userlist')
		.select('first_name, last_name')
		.eq('id', user.id)
		.single();

	return {
		//@ts-ignore
		bookingList: transformedData as BookingDetail[],
		currUser: UserData ? UserData.first_name + ' ' + UserData.last_name : ''
	};
};
