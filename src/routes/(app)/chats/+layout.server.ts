import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { handleLoginRedirect } from '$lib/utils';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) {
		const fromUrl = url.pathname + url.search;

		throw redirect(302, handleLoginRedirect(url));
	}

	const conversations: Conversation[] = [
		{
			id: 100,
			lstngName: '3 beach Island Hopping',
			lstngId: 13,
			sender: {
				userId: 'tourist_001',
				// userType: 1,
				name: {
					first_name: 'John',
					last_name: 'Doe'
				}
			},
			receiver: {
				userId: 'business_001',
				// userType: 2,
				name: {
					first_name: 'Alice',
					last_name: 'Smith'
				}
			},
			messages: [
				{
					id: 'msg001',

					senderId: 'tourist_001',
					receiverId: 'business_001',
					messageContent: 'Hi maam/sir, good morning.',
					timestamp: '2024-11-25T08:30:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg002',

					senderId: 'tourist_001',
					receiverId: 'business_001',
					messageContent: 'Naay available room karon?',
					timestamp: '2024-11-25T08:35:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg003',

					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'Yes maam.',
					timestamp: '2024-11-25T08:40:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg004',

					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'Mag book ka maam?',
					timestamp: '2024-11-25T08:42:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg005',

					senderId: 'tourist_001',
					receiverId: 'business_001',
					messageContent: 'Yes maam/Sir.',
					timestamp: '2024-11-25T08:45:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg006',

					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'Ikaw ra isa maam?',
					timestamp: '2024-11-25T09:00:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg007',

					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'Maka discount ka maam, kung naa kay kauban.',
					timestamp: '2024-11-25T09:05:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg008',

					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'Plus naay pay giveaway.',
					timestamp: '2024-11-25T09:10:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg009',

					senderId: 'tourist_001',
					receiverId: 'business_001',
					messageContent: 'Yes maam, mag book ko karon dayon, og duha mi kabuuk.',
					timestamp: '2024-11-25T09:15:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg010',

					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'Okay maam, wait for a bit.',
					timestamp: '2024-11-25T09:20:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg011',

					senderId: 'tourist_001',
					receiverId: 'business_001',
					messageContent: 'Okay maam.',
					timestamp: '2024-11-25T09:30:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg012',

					senderId: 'tourist_001',
					receiverId: 'business_001',
					messageContent: 'Maka mi discount maam?',
					timestamp: '2024-11-25T09:33:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg012',

					senderId: 'tourist_001',
					receiverId: 'business_001',
					messageContent: 'Pila pud maam?',
					timestamp: '2024-11-25T09:35:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg013',

					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'Wait lang maam, kadali ra jud, naa pay ko gi process.',
					timestamp: '2024-11-25T09:40:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg014',

					senderId: 'tourist_001',
					receiverId: 'business_001',
					messageContent: 'Okay maam, wait rako.',
					timestamp: '2024-11-25T09:45:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg015',
					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'Okay maam.',
					timestamp: '2024-11-25T09:50:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg016',
					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'I’m done processing, your discount is 10%. ',
					timestamp: '2024-11-25T10:00:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg017',
					senderId: 'tourist_001',
					receiverId: 'business_001',
					messageContent: 'Thanks maam, mag book ko karon.',
					timestamp: '2024-11-25T10:10:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg018',
					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'Thanks also maam, we look forward to your stay!',
					timestamp: '2024-11-25T10:15:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg019',
					senderId: 'tourist_001',
					receiverId: 'business_001',
					messageContent: 'Can I confirm my reservation for next weekend?',
					timestamp: '2024-11-25T10:20:00.000000+00',
					status: 'read'
				},
				{
					id: 'msg020',
					senderId: 'business_001',
					receiverId: 'tourist_001',
					messageContent: 'Yes, your reservation is confirmed for next weekend!',
					timestamp: '2024-11-25T10:25:00.000000+00',
					status: 'unread'
				}
			]
		},
		{
			id: 200,
			lstngName: 'Island Breeze Car Rentals',
			lstngId: 14,
			sender: {
				userId: 'tourist_002',
				// userType: 1,
				name: {
					first_name: 'Sarah',
					last_name: 'Johnson'
				}
			},
			receiver: {
				userId: 'business_002',
				// userType: 2,
				name: {
					first_name: 'Tom',
					last_name: 'Williams'
				}
			},
			messages: [
				{
					id: 'msg003',

					senderId: 'tourist_002',
					receiverId: 'business_002',
					messageContent:
						'I am looking for a place to stay for the weekend. Do you have availability?',
					timestamp: '2024-11-25T10:15:00.000000+00', // Correct Supabase format
					status: 'read'
				},
				{
					id: 'msg004',
					senderId: 'business_002',
					receiverId: 'tourist_002',
					messageContent: 'Yes, we have rooms available. Would you like to book one?',
					timestamp: '2024-11-25T10:30:00.000000+00', // Correct Supabase format
					status: 'read'
				}
			]
		},
		{
			id: 300,
			lstngName: 'Island View Hotel',
			lstngId: 15,
			sender: {
				userId: 'admin_001',
				// userType: 3,
				name: {
					first_name: 'Karen',
					last_name: 'Martinez'
				}
			},
			receiver: {
				userId: 'business_003',
				// userType: 2,
				name: {
					first_name: 'Laura',
					last_name: 'King'
				}
			},
			messages: [
				{
					id: 'msg005',

					senderId: 'admin_001',
					receiverId: 'business_003',
					messageContent: 'Please update your business information on the portal.',
					timestamp: '2024-11-25T11:00:00.000000+00', // Correct Supabase format
					status: 'unread'
				},
				{
					id: 'msg006',
					senderId: 'business_003',
					receiverId: 'admin_001',
					messageContent: 'Thank you, I will update it right away.',
					timestamp: '2024-11-25T11:15:00.000000+00', // Correct Supabase format
					status: 'read'
				}
			]
		},
		{
			id: 400,
			lstngName: 'Sophia Villa Resort',
			lstngId: 16,
			sender: {
				userId: 'tourist_003',
				// userType: 1,
				name: {
					first_name: 'James',
					last_name: 'Brown'
				}
			},
			receiver: {
				userId: 'business_004',
				// userType: 2,
				name: {
					first_name: 'Diana',
					last_name: 'Miller'
				}
			},
			messages: [
				{
					id: 'msg007',
					senderId: 'tourist_003',
					receiverId: 'business_004',
					messageContent: 'Do you have cottages available for a family reunion?',
					timestamp: '2024-11-25T12:00:00.000000+00', // Correct Supabase format
					status: 'read'
				},
				{
					id: 'msg008',

					senderId: 'business_004',
					receiverId: 'tourist_003',
					messageContent:
						'Yes, we have cottages available for group events. Let me know your dates.',
					timestamp: '2024-11-25T12:30:00.000000+00', // Correct Supabase format
					status: 'read'
				}
			]
		},
		{
			id: 400,
			lstngName: 'Negerz Chiropracben Traditional Hilot',
			lstngId: 17,
			sender: {
				userId: 'tourist_004',
				// userType: 1,
				name: {
					first_name: 'Olivia',
					last_name: 'Davis'
				}
			},
			receiver: {
				userId: 'business_005',
				// userType: 2,
				name: {
					first_name: 'David',
					last_name: 'Harris'
				}
			},
			messages: [
				{
					id: 'msg009',

					senderId: 'tourist_004',
					receiverId: 'business_005',
					messageContent: 'I am interested in learning more about your services for events.',
					timestamp: '2024-11-25T13:00:00.000000+00', // Correct Supabase format
					status: 'read'
				},
				{
					id: 'msg010',

					senderId: 'business_005',
					receiverId: 'tourist_004',
					messageContent: 'We offer event packages. Let me know your requirements!',
					timestamp: '2024-11-25T13:30:00.000000+00', // Correct Supabase format
					status: 'read'
				}
			]
		}
	];

	return { conversations };
};
