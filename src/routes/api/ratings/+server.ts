import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const { data, error } = await locals.supabase
			.from('ratings')
			.select('*, user: userlist(first_name, last_name)');

		if (error) {
			return json({ message: 'Error fetching ratings!', status: 'error' });
		}

		return json({ data, status: 'success' });
	} catch (error) {
		return json({ message: 'Error fetching the ratings.', status: 'error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ locals, request }) => {
	try {
		const { user } = await locals.safeGetSession();
		if (!user) {
			return json({
				status: 'error',
				message: `No user`
			});
		}

		const formData = await request.json();

		const { data, error } = await locals.supabase.from('ratings').insert([
			{
				user_id: user.id,
				lstng_id: formData.lstng_id,
				rating: formData.rating,
				booking_id: formData.booking_id,
				rating_content: formData.rating_content
			}
		]);

		if (error) {
			return json({ message: 'Error when inserting rating!', status: 'error' });
		}

		return json({ message: 'Form submitted successfully!', status: 'success' });
	} catch (error) {
		return json({ message: 'Error submitting the form.', status: 'error' }, { status: 500 });
	}
};
