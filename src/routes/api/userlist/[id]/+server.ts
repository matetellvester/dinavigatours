import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		const { id } = params;

		const { data, error } = await locals.supabase
			.from('userlist')
			.select('*')
			.eq('id', id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return json({ success: true, data: data });
	} catch (error) {
		return json({ success: false, error }, { status: 500 });
	}
};
