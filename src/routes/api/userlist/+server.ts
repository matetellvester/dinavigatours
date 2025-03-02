import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {
	try {
		const { user } = await locals.safeGetSession();

		if (!user) {
			return json({
				status: 'error',
				message: 'No user found'
			});
		}

		const formData = await request.json();

		const { data, error } = await locals.supabase
			.from('userlist')
			.update([formData])
			.eq('id', user.id);

		// Check for errors
		if (error) {
			console.log(error);

			return json({ message: 'Error when inserting!', status: 'error' });
		}

		// Success response
		return json({ message: 'Form submitted successfully!', status: 'success' });
	} catch (error) {
		return json({ message: 'Error submitting the form.', status: 'error' }, { status: 500 });
	}
};
