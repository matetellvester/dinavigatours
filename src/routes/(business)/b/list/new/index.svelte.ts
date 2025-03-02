import { v4 as uuidv4 } from 'uuid';

interface MediaSource {
	src: string;
	name: string;
	copyright: string;
	desp: string;
	path: string;
	isThumbnail: boolean;
	file: File;
	type: 'image' | 'video';
}

interface Room {
	info: {
		name: string;
		type: string;
		capacity: string;
		price: string;
	};
	beds: {
		single: boolean;
		double: boolean;
		king: boolean;
		queen: boolean;
	};
	amenities: string[];
}

/**
 * Mao ni ang object na e store ang new room
 */
export const currRoom = $state<{ room: Room & { id: string | null }; reset: () => void }>({
	room: {
		id: null,
		info: {
			name: '',
			type: '',
			capacity: '',
			price: ''
		},
		beds: {
			single: false,
			double: false,
			king: false,
			queen: false
		},
		amenities: []
	},
	reset() {
		this.room = {
			id: null,
			info: {
				name: '',
				type: '',
				capacity: '',
				price: ''
			},
			beds: {
				single: false,
				double: false,
				king: false,
				queen: false
			},
			amenities: []
		};
	}
});

interface Rooms {
	val: (Room & { id: string })[];
	add: (room: Room) => void;
	remove: (id: string) => void;
	update: (id: string, room: Room) => void;
}

export const rooms = $state<Rooms>({
	val: [],
	add(room) {
		this.val = [{ id: uuidv4(), ...room }, ...this.val];
	},
	remove(id) {
		this.val = this.val.filter((r) => r.id !== id);
	},
	update(id, room) {
		this.val = this.val.map((r) => (r.id === id ? { ...r, room } : r));
	}
});
