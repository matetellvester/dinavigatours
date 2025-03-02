import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request, locals }) => {
	console.log('hey');

	return json({ success: true, message: 'Yeyy' });
};
