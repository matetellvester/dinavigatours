import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url }) => {
	const columnsParam = url.searchParams.get('get');

	if (!columnsParam) {
		return json({ data: null, message: 'no parameter' }, { status: 400 });
	}

	if (columnsParam === 'getAllTouristUser' || columnsParam === 'getAllAgencies') {
		return json({ data: await getAllUserCounts(locals, columnsParam) });
	}

	if (columnsParam === 'getAllListing' || columnsParam === 'getAllAttractions') {
		return json({ data: await getAllListing(locals, columnsParam) });
	}

	if (columnsParam === 'getAllEvents') {
		return json({ data: await getAllEvents(locals) });
	}

	if (columnsParam === 'getAllBooked') {
		return json({ data: await getAllBooked(locals) });
	}

	return json({ data: null, message: 'no match parameter' }, { status: 400 });
};

async function getAllUserCounts(locals: App.Locals, role: 'getAllTouristUser' | 'getAllAgencies') {
	const { data, error } = await locals.supabase
		.from('userlist')
		.select('created_at')
		.eq('role', role === 'getAllAgencies' ? 2 : 3);

	if (error) {
		return { data: null, message: JSON.stringify(error, null, 2) };
	}

	return data;
}

async function getAllListing(locals: App.Locals, role: 'getAllListing' | 'getAllAttractions') {
	const { data, error } = await locals.supabase
		.from('ltsng_basic_info')
		.select('created_at')
		.eq('can_book', role === 'getAllListing' ? true : false);

	if (error) {
		return { data: null, message: JSON.stringify(error, null, 2) };
	}

	return data;
}

async function getAllEvents(locals: App.Locals) {
	const { data, error } = await locals.supabase.from('events').select('created_at');

	if (error) {
		return { data: null, message: JSON.stringify(error, null, 2) };
	}

	return data;
}

async function getAllBooked(locals: App.Locals) {
	const { data, error } = await locals.supabase.from('booking_info').select('created_at, status');

	if (error) {
		return { data: null, message: JSON.stringify(error, null, 2) };
	}

	return data;
}
