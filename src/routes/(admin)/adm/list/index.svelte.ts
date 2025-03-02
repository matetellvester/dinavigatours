export const dialogState = $state({ value: false });

type Actions = {
	id: number;
	action: 'approve' | 'decline';
	businessName: string;
};
export const dialogActionsState = $state({
	value: {
		id: 0,
		action: 'decline',
		businessName: ''
	} as Actions
});

export const deleteDialog = $state({
	value: {
		id: 0,
		state: false
	}
});

type State = {
	value: {
		id: number;
		name: string;
		category: string;
		is_approved: boolean | null;
		municipality: string;
		bgry: string;
		user: { last_name: string; first_name: string };
	}[];
	remove: (id: number) => void;
	updateApproval: (id: number, is_approved: boolean) => void;
};

export const admBusinessList = $state<State>({
	value: [],
	remove(id) {
		this.value = this.value.filter((b) => b.id !== id);
	},
	updateApproval(id, is_approved) {
		this.value = this.value.map((b) => (b.id === id ? { ...b, is_approved } : b));
	}
});
