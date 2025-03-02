import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, locals, params }) => {
	const { id } = params;
	const updates = await request.json(); // Get the data from the request body

	if (!id || Object.keys(updates).length === 0) {
		throw error(400, 'Invalid request');
	}

	try {
		// Perform the update in Supabase
		const { data, error: updateError } = await locals.supabase
			.from('booking_info')
			.update(updates)
			.eq('id', id);

		if (updateError) {
			throw error(500, updateError.message);
		}
		const action = updates.status === 'canceled' ? 'Approved' : 'Declined';
		return json({ success: true, message: action + 'Successfully!', data });
	} catch (err) {
		throw error(500, 'Internal Server Error');
	}
};
