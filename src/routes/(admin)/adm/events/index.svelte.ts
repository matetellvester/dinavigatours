interface EventsList {
	value: Event[] | null;
	remove(id: number): void;
}

export const eventsList = $state<EventsList>({
	value: null,
	remove(id) {
		if (this.value) {
			this.value = this.value.filter((b) => b.id !== id);
		}
	}
});

export const eventDialogState = $state<{ value: { state: boolean; id: number | null } }>({
	value: { state: false, id: null }
});
