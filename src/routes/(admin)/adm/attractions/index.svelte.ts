type State = {
	value:
		| (Omit<ExploreItem, 'rating' | 'media' | 'map_link'> & {
				purok: number;
				mapLink: string;
				category: string;
				branch: string;
		  })[]
		| null;
	remove: (id: number) => void;
};

export const attractionList = $state<State>({
	value: null,
	remove(id) {
		if (this.value) {
			this.value = this.value.filter((b) => b.id !== id);
		}
	}
});

export const attrtSheetState = $state<{ value: boolean }>({ value: false });

type Attraction = {
	value:
		| (Omit<ExploreItem, 'rating' | 'media' | 'map_link'> & {
				purok: number;
				mapLink: string;
				category: string;
				branch: string;
		  })
		| null;
};

export const selectedAttraction = $state<Attraction>({ value: null });
