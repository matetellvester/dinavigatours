type ListingModalState = {
	value: {
		state: boolean;
		type: 'canceled' | 'deleted' | null;
		id: number | null;
	};
};

export const removeListingModal = $state<ListingModalState>({
	value: {
		state: false,
		type: null,
		id: null
	}
});
