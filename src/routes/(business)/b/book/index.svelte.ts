export const declineDialogState = $state({
	value: false
});
export const approveDialogState = $state({
	value: false
});

export const reasonDialog = $state({
	value: {
		state: false,
		type: 'decline',
		reason: ''
	}
});

export const checkInOutDialog = $state<{
	value: {
		state: boolean;
		id: number | null;
		status: 'check-in' | 'complete';
		down_payment: number | null;
		user_id: string;
		for: string;
	};
}>({
	value: {
		state: false,
		id: null,
		status: 'check-in',
		down_payment: null,
		user_id: '',
		for: ''
	}
});

export const paymentDetailDialog = $state<{
	value: { state: boolean; full_payment: number | null; down_payment: number | null };
}>({
	value: { state: false, full_payment: null, down_payment: null }
});

export const declineDialogInfo = $state<{
	value: {
		id: null | number;
		user_id: string;
		client: string;
		for: string;
		no: string;
		date: string;
		down: number | null;
	};
}>({
	value: {
		id: null,
		user_id: '',
		client: '',
		for: '',
		no: '',
		date: '',
		down: null
	}
});

type BookingDetail = {
	id: number;
	created_at: string;
	user_id: string;
	first_name: string;
	last_name: string;
	contact_info: string;
	booking_date: string;
	checkin: string;
	checkout: string;
	status: BookingStatus;
	lstng_id: number;
	remarks: string;
	down_payment: number | null;
	full_payment: number | null;
	ltsng_basic_info: {
		name: string;
		branch: string;
		category: string;
	};
	user: { last_name: string; first_name: string; contact_info: string };
};

type State = {
	value: BookingDetail[];
	remove: (id: number) => void;
	setStatus: (id: number, action: BookingStatus, full_payment?: number) => void;
	setReason: (id: number, remark: string) => void;
};
export const bookingList = $state<State>({
	value: [],
	remove(id) {
		this.value = this.value.filter((b) => b.id !== id);
	},
	setStatus(id, action, full_payment?: number) {
		if (full_payment) {
			this.value = this.value.map((b) =>
				b.id === id ? { ...b, status: action, full_payment: full_payment } : b
			);
			return;
		}
		this.value = this.value.map((b) => (b.id === id ? { ...b, status: action } : b));
	},
	setReason(id, remark) {
		this.value = this.value.map((b) => (b.id === id ? { ...b, remarks: remark } : b));
	}
});
