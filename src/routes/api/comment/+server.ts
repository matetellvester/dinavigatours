import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

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

		formData.user_id = user.id;

		const { data, error } = await locals.supabase.from('comments').insert([formData]).select();

		if (error) {
			return json({ message: 'Error when inserting!', status: 'error' });
		}

		const newComment = data[0] as any;

		const { data: data2, error: error2 } = await locals.supabase
			.from('userlist')
			.select('last_name, first_name')
			.eq('id', user.id);

		if (error2) {
			console.error('Error when getting the user after the saving');
			return json({ message: 'Error when getting the user after the saving!', status: 'error' });
		}

		newComment.user = data2[0];

		return json({ message: 'Form submitted successfully!', status: 'success', data: newComment });
	} catch (error) {
		return json({ message: 'Error submitting the form.', status: 'error' }, { status: 500 });
	}
};
