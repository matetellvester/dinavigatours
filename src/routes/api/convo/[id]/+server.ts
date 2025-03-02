import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) return json({ message: 'Walay user', status: 'error' });

	const id = params.id;

	const { data, error } = await locals.supabase
		.from('convo_info')
		.select(
			`
    id,lstngName,lstngId,
    sender:userlist!convo_info_sender_fkey(userId:id, first_name, last_name),
    receiver:userlist!convo_info_receiver_fkey(userId:id, first_name, last_name),
    messages(id,status,senderId,receiverId,convoId,messageContent,timestamp)
    `
		)
		.eq('id', id)
		.limit(1, { referencedTable: 'messages' })
		.order('timestamp', { referencedTable: 'messages', ascending: false });

	if (error) {
		console.error('Error sa pag fetch sa conversations: ' + JSON.stringify(error, null, 2));
		return json({ message: 'Error sa pag fetch sa conversations', status: 'error' });
	}

	const formattedData = data.map((convo) => ({
		...convo,
		sender: {
			//@ts-ignore
			userId: convo.sender.userId,
			name: {
				//@ts-ignore
				first_name: convo.sender.first_name, //@ts-ignore
				last_name: convo.sender.last_name
			}
		},
		receiver: {
			//@ts-ignore
			userId: convo.receiver.userId,
			name: {
				//@ts-ignore
				first_name: convo.receiver.first_name, //@ts-ignore
				last_name: convo.receiver.last_name
			}
		},
		messages: convo.messages[0]
	}));

	return json({ data: formattedData, status: 'success' });
};
