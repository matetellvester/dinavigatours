import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, params }) => {
	try {
		const { id } = params;

		// Fetch the data with the validated columns
		const { data, error } = await locals.supabase.from('ratings').select('*').eq('lstng_id', id);

		if (error) {
			throw new Error(error.message);
		}

		return json({ success: true, data });
	} catch (error) {
		return json({ success: false, error }, { status: 500 });
	}
};
