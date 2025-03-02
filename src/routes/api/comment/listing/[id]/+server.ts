import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	try {
		const { id } = params;

		// Fetch the data with the validated columns
		const { data, error } = await locals.supabase
			.from('comments')
			.select('*, user: userlist(first_name, last_name)')
			.eq('lstng_id', id);

		if (error) {
			throw new Error(error.message);
		}

		return json({ success: true, data });
	} catch (error) {
		return json({ success: false, error }, { status: 500 });
	}
};
