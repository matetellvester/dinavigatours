import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const { data, error } = await locals.supabase
		.from('userlist')
		.select('contactInfos')
		.eq('role', '1');

	if (error) {
		return json({ data: null, message: JSON.stringify(error, null, 2) });
	}

	return json(data);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const id = locals.user?.id || (await locals.safeGetSession()).user?.id;
	const updates = await request.json();

	if (!updates) {
		return json({
			success: false,
			message: `Unable to save, please try again`
		});
	}

	// JSON.parse(formData.get('obj') as string)
	const { error } = await locals.supabase.from('userlist').update(updates).eq('id', id);

	if (error) {
		console.log(id);

		console.error(error);
		return json({
			success: false,
			message: `Unable to save, please try again`
		});
	}

	return json({ success: true });
};
