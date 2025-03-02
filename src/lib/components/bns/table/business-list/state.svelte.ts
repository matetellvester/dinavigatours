// import type { BusinessList } from '$bns-comps';
type State = {
	value: {
		id: number;
		name: string;
		category: string;
		is_approved: boolean | null;
		municipality: string;
		bgry: string;
	}[];
	remove: (id: number) => void;
};
export const businessList = $state<State>({
	value: [],
	remove(id) {
		this.value = this.value.filter((b) => b.id !== id);
	}
});
