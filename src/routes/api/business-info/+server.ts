import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, locals, url }) => {
	const id = url.searchParams.get('id') as number | null;
	if (!id) {
		return json({ success: false, message: 'No id', result: null });
	}

	const { data, error } = await locals.supabase
		.from('business_info')
		.select('add_desc')
		.eq('id', id);

	if (error) {
		return json({ success: false, message: 'Error to description: ' + error, result: null });
	}

	return json({ success: true, message: null, result: data[0].add_desc });
};
