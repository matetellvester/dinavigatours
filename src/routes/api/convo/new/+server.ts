import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const req = await request.json();

	if (!locals.user) return json({ message: 'Walay user', status: 'error' });
	// const id = locals.user

	const { data, error } = await locals.supabase
		.from('ltsng_basic_info')
		.select('id, user_id, name')
		.eq('id', req.lstngId)
		.single();

	if (error) {
		console.error('Error sa pag kuha sa id: ' + JSON.stringify(error, null, 2));
		return json({ message: 'Error sa pag kuha sa id!', status: 'error' });
	}

	const { data: data2, error: error2 } = await locals.supabase
		.from('convo_info')
		.insert([
			{
				sender: locals.user.id,
				receiver: data.user_id,
				lstngId: data.id,
				lstngName: data.name
			}
		])
		.select()
		.single();

	if (error2) {
		console.error('Error sa pag insert sa convo table: ' + JSON.stringify(error2, null, 2));
		return json({ message: 'Error sa pag insert sa convo table', status: 'error' });
	}

	const { data: data3, error: error3 } = await locals.supabase
		.from('messages')
		.insert([
			{
				senderId: locals.user.id,
				receiverId: data.user_id,
				convoId: data2.id,
				messageContent: req.messageContent.trim()
			}
		])
		.select()
		.single();

	if (error3) {
		console.error('Error sa pag insert sa message table: ' + JSON.stringify(error3, null, 2));
		return json({ message: 'Error sa pag insert sa message table', status: 'error' });
	}

	const convoInfo = await getConvoInfo(locals, data3.convoId);

	return json({ data: data3, convoInfo, status: 'success' });
};

async function getConvoInfo(locals: App.Locals, id: string) {
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

	return formattedData[0];
}
