import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, params }) => {
	const { id } = params;

	// Fetch data from events-media table
	const { data, error } = await locals.supabase
		.from('events-media')
		.select('*')
		.eq('event_id', id)
		.single();

	if (error) {
		return json({
			status: 500,
			body: { error: 'Failed to fetch data from events-media table' }
		});
	}

	return json({ status: 200, body: data });
};
