import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

declare global {
	interface String {
		/**Return a string in proper case */
		toProperCase(): string;
	}

	interface String {
		/**Return a string in proper case */
		toProperCase(): string;
	}

	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{
				session: Session | null;
				user: User | null;
				role: UserType | null;
				role: UserType | null;
			}>;
			session: Session | null;
			user: User | null;
			role: UserType | null;
			role: UserType | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
	/**
	 * * **1** = Admin
	 *
	 * * **2** = Business User
	 *
	 * * **3** = Tourist
	 */
	type UserType = 1 | 2 | 3;
	/**
	 * * **Admin** = 1
	 *
	 * * **Business User** = 2
	 *
	 * * **Tourist** = 3
	 */
	type UserRole = 'admin' | 'business owner' | 'tourist';

	type ExploreItem = {
		id: number;
		name: string;
		rate: number;
		description: string;
		municipality: string;
		bgry: string;
		purok: number | null;
		map_link: string;
		rating?: { average: number; count: number };
		media: Omit<Media, 'description' | 'copyright_link'>[];
		portInfo: string | null;
		contacts:
			| {
					name: string;
					label: string;
					link: string;
			  }[]
			| null;
	};

	type Media = {
		src: string;
		type: string;
		description: string;
		copyright_link: string;
		isThumbnail: boolean;
	};

	interface Event {
		id: number;
		name: string;
		description: string | null;
		start_datetime: string;
		end_datetime: string;
		start_time: string | null;
		end_time: string | null;
		municipality: string;
		bgry: string | null;
		purok: number | null;
		type: 'one_time' | 'yearly' | 'monthly';
		month: string;
		expired: boolean | null;
		day_range: string;
		time_type: 'default' | 'whole_day' | '24_Hour' | null;
		map_link: string;
	}

	type IslandHoppingTour = {
		id: number;
		/**
		 * ISO timestamp
		 */
		created_at: string;
		user_id: string;
		name: string;
		category: string;
		branch: string;
		branch_info: { [key: string]: unknown };
		is_approved: boolean | null;
		rate: number;
		description: string;
		municipality: string;
		bgry: string;
		purok: string;
		map_link: string;
		can_book: boolean;
		rating?: { average: number; count: number };
	};

	type Room = {
		info: {
			name: string;
			type: string;
			capacity: string;
			price: string;
		};
		beds: string[];
		amenities: string[];
	};

	type Bgry = {
		name: string;
		colloquial?: string;
		poblacion?: true;
	};

	type UserName = {
		first_name: string;
		last_name: string;
	};

	type AppUser = {
		userId: string;
		// userType: UserType;
		name: UserName; // Add the name here for display
	};

	type Message = {
		id: string;
		convoId: number;
		senderId: string;
		receiverId: string;
		messageContent: string;
		timestamp: string;
		status: 'read' | 'unread';
	};

	type ConversationInfo = {
		id: number;
		lstngName: string;
		lstngId: number;
		sender: AppUser;
		receiver: AppUser;
	};

	type Conversation = ConversationInfo & {
		messages: Message[];
	};

	type Location = {
		bgry: string;
		purok: string;
		municipality: string;
	};

	type TouristAttractions = {
		title: string;
		location: Location;
		evacuation: string;
		condition: string;
		map_link: string;
		imgs: {
			path: string;
			id: string;
			fullPath: string;
		}[];
	};

	type Rating = {
		id: number;
		user_id: string;
		lstng_id: number;
		rating: number;
		created_at: string;
		booking_id: number;
		rating_content: string;
	};

	type BookingStatus = 'decline' | 'canceled' | 'approved' | 'pending' | 'check-in' | 'complete';

	interface Vessel {
		id: number;
		name: string;
		departure: string;
		arrival: string;
	}
}

export {};
