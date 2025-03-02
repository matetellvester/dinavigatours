import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url }) => {
	const convoId = url.searchParams.get('convoId');

	if (!convoId) return json({ message: 'query param na convoId', status: 'error' });

	if (!locals.user) return json({ message: 'Walay user', status: 'error' });

	const { data, error } = await locals.supabase
		.from('messages')
		.select('id, senderId, receiverId, messageContent, timestamp, status')
		.eq('convoId', convoId)
		.order('timestamp', { ascending: true });

	if (error) {
		console.error('Error sa pag fetch sa messages: ' + JSON.stringify(error, null, 2));
		return json({ message: 'Error sa pag fetch sa messages', status: 'error' });
	}

	// console.log(data);

	return json({ data, status: 'success' });
};

export const POST: RequestHandler = async ({ request, locals, url }) => {
	// const convoId = url.searchParams.get('convoId');
	const req = await request.json();

	// if (!convoId) return json({ message: 'query param na convoId', status: 'error' });

	if (!locals.user) return json({ message: 'Walay user', status: 'error' });

	console.warn(req.convoId);

	const { data, error } = await locals.supabase
		.from('messages')
		.insert([
			{
				senderId: locals.user.id,
				receiverId: req.receiverId,
				convoId: req.convoId,
				messageContent: req.messageContent.trim()
			}
		])
		.eq('convoId', req.convoId)
		.select()
		.single();

	if (error) {
		console.error('Error sa pag insert sa message table: ' + JSON.stringify(error, null, 2));
		return json({ message: 'Error sa pag insert sa message table', status: 'error' });
	}
	return json({ data, status: 'success' });
};
