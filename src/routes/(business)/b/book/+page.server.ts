import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user || (await locals.safeGetSession()).user;

	if (!user) {
		return { bookingList: [] };
	}

	const { data, error } = await locals.supabase
		.from('booking_info')
		.select(
			`
      id,
      created_at,
      user_id,
      contact_info,
      booking_date,
      checkin,
      checkout,
      status,
      lstng_id,
      remarks,
      down_payment,
      full_payment,
      ltsng_basic_info (
        name,
        category,
        branch
      ),
      user: userlist(last_name, first_name, contact_info)
    `
		)
		.eq('ltsng_basic_info.user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) {
		return { bookingList: [] };
	}

	type BookingDetail = {
		id: number;
		created_at: string;
		user_id: string;
		first_name: string;
		last_name: string;
		contact_info: string;
		booking_date: string;
		checkin: string;
		checkout: string;
		status: BookingStatus;
		lstng_id: number;
		remarks: string;
		down_payment: number | null;
		full_payment: number | null;
		ltsng_basic_info: {
			name: string;
			branch: string;
			category: string;
		};
		user: { last_name: string; first_name: string; contact_info: string };
	}[];

	return {
		// @ts-ignore
		bookingList: data as BookingDetail[]
	};
};
