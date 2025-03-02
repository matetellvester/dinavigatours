import { formatDate } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {
	try {
		const user = locals.user || (await locals.safeGetSession()).user;

		if (!user) {
			return json({
				status: 'error',
				message: `No user`
			});
		}

		const formData = await request.json();

		formData.user_id = user.id;

		const userName = formData.userName;
		delete formData.userName;

		const { error } = await locals.supabase.from('booking_info').insert([formData]);

		if (error) {
			console.error(JSON.stringify(error, null, 2));
			return json({ message: 'Error when inserting!', status: 'error' });
		}

		const LstngNameAndUserId = await getLstngNameAndUserId(locals, formData.lstng_id);

		if (LstngNameAndUserId) {
			await newNotif(locals, { ...LstngNameAndUserId, userName, checkin: formData.checkin });
		}

		return json({ message: 'Form submitted successfully!', status: 'success' });
	} catch (error) {
		return json({ message: 'Error submitting the form.', status: 'error' }, { status: 500 });
	}
};

export async function GET({ url, locals }) {
	const method = url.searchParams.get('method'); // Custom action method
	const listingId = url.searchParams.get('listingId');

	if (!method) {
		return json({ hasBooking: false, message: 'Method not specified' }, { status: 400 });
	}

	if (method === 'checkBooking') {
		if (!locals.user?.id || !listingId) {
			return json({ hasBooking: false, message: 'no  user or missing listingId' });
		}

		// Check if booking exists
		const { data, error } = await locals.supabase
			.from('booking_info')
			.select('id')
			.eq('user_id', locals.user.id)
			.eq('lstng_id', listingId)
			.eq('status', 'confirmed')
			.single();

		if (error) {
			// console.log(error.details);
			if (error.details.includes('The result contains 0 rows')) {
				const res = await getConvoId(locals, locals.user.id, listingId);

				return json({ hasBooking: false, convoId: res }, { status: 200 });
			}
			return json({ message: 'Error checking booking', error }, { status: 500 });
		}

		const res = await getConvoId(locals, locals.user.id, listingId);

		return json({ hasBooking: !!data, convoInfo: res }, { status: 200 });
	}

	return json({ message: `Unknown method: ${method}` }, { status: 400 });
}

async function newNotif(
	locals: App.Locals,
	data: { name: any; user_id: any; userName: any; checkin: any }
) {
	const { error } = await locals.supabase.from('notification').insert([
		{
			user_id: data.user_id,
			title: 'New Booking Received',
			content: `${data.userName} booked ${data.name} for ${formatDate(data.checkin)}`
		}
	]);

	if (error) {
		console.error('Naay error sa pag insert og new notif');
	}
}

async function getLstngNameAndUserId(locals: App.Locals, id: any) {
	const { data, error } = await locals.supabase
		.from('ltsng_basic_info')
		.select('name, user_id')
		.eq('id', id)
		.single();

	if (error) {
		console.log(error);

		return null;
	}

	return data;
}

async function getConvoId(locals: App.Locals, id: string, listingId: string) {
	const { data, error } = await locals.supabase
		.from('convo_info')
		.select('id')
		.eq('sender', id)
		.eq('lstngId', listingId)
		.single();

	if (error) {
		if (error.details.includes('The result contains 0 rows')) return null;
		console.error('Naay error sa pag kuha sa convo info' + JSON.stringify(error, null, 2));
		return json({ message: 'Naay error sa pag kuha sa convo info', error });
	}

	return data.id;
}
