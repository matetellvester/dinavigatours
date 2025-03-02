import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const { id } = await request.json();
	const { data, error } = await locals.supabase.from('business_info').delete().eq('id', id);

	if (error) {
		return json({
			success: false,
			message: error
		});
	}

	return json({ success: true, message: null });
};
