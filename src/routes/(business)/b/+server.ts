import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url }) => {
	const columnsParam = url.searchParams.get('get');

	const id = locals.user?.id || (await locals.safeGetSession()).user?.id;

	if (!id) {
		return json({
			success: false,
			status: 'error',
			message: `No user`
		});
	}

	if (!columnsParam) {
		return json({ success: false, data: null, message: 'no parameter' }, { status: 400 });
	}

	if (columnsParam === 'getBooking') {
		return json({ success: true, data: await getListing(locals, id) });
	}

	return json({ success: true, data: await getBooking(locals, columnsParam, id) });
};

async function getListing(locals: App.Locals, id: string) {
	const { data, error } = await locals.supabase
		.from('ltsng_basic_info')
		.select('created_at')
		.eq('user_id', id);

	if (error) {
		return { data: null, message: JSON.stringify(error, null, 2) };
	}

	return data;
}

async function getBooking(locals: App.Locals, status: string, id: string) {
	const { data, error } = await locals.supabase
		.from('booking_info')
		.select('created_at')
		// .eq('user_id', id)
		.eq('status', status);

	if (error) {
		return { data: null, message: JSON.stringify(error, null, 2) };
	}

	return data;
}
