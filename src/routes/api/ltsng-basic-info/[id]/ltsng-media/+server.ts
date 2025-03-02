import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	try {
		const { id } = params;

		const { data, error } = await locals.supabase
			.from('ltsng_media')
			.select('*')
			.eq('lstng_id', id);

		if (error) {
			console.error('Error sa pag kuha sa images: ', JSON.stringify(error, null, 2));
			return json({ success: false, error }, { status: 500 });
		}

		return json({ success: true, data: data });
	} catch (error) {
		return json({ success: false, error }, { status: 500 });
	}
};
