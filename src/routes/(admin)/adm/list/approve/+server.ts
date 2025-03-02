import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { type, id, action } = await request.json();

	const { data, error } = await locals.supabase
		.from('business_info')
		.update({ isApproved: action === 'approve' })
		.eq('id', id);

	if (error) {
		console.error('ERROR updating approve', error);
		return json({
			success: false,
			message: error
		});
	}

	const message = action === 'approve' ? 'Approved Succesfully' : 'Rejected Succesfully';

	return json({ success: true, message });
};
