import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user || (await locals.safeGetSession()).user;

	if (!user) {
		return json({
			status: 'error',
			message: `No user`,
			data: null
		});
	}

	const id = user.id;

	const { data, error } = await locals.supabase.from('userlist').select('*').eq('id', id);

	if (error) {
		return json({ success: false, data: null });
	}

	return json({ success: true, data: data[0] });
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	const user = locals.user || (await locals.safeGetSession()).user;

	if (!user) {
		return json({
			status: 'error',
			message: `No user`,
			data: null
		});
	}

	const id = user.id;
	const body = await request.json();

	const { data, error } = await locals.supabase.from('userlist').update(body).eq('id', id).single();

	if (error) {
		return json({ success: false, data: null });
	}

	return json({ success: true, data });
};
