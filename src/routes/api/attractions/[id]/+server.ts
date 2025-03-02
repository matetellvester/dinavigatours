import { json, type RequestHandler } from '@sveltejs/kit';
import qs from 'qs';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const id = params.id;
	const formData = await request.text();
	const updates: Record<string, any> = qs.parse(formData);

	if (!id || Object.keys(updates).length === 0) {
		return json({ success: false, error: 'Invalid request' }, { status: 400 });
	}

	try {
		const { error } = await locals.supabase
			.from('ltsng_basic_info')
			.update({
				name: updates.name,
				rate: updates.rate,
				description: updates.description.replace(/\n/g, ' ').trim(),
				category: updates.main_categ,
				branch: updates.sub_categ,
				municipality: updates.location.municipality,
				bgry: updates.location.bgry,
				purok: updates.location.purok,
				map_link: updates.location.map_link
			})
			.eq('id', id);

		if (error) {
			console.error('Database update error:', error);
			return json({ success: false, error: JSON.stringify(error, null, 2) }, { status: 500 });
		}

		return json({ success: true });
	} catch (err) {
		console.error('Unexpected error:', err);
		return json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
	}
};
