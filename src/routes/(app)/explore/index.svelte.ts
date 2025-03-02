export const exploreList = $state<{
	value: (ExploreItem & { branch: string; can_book: boolean })[];
}>({
	value: []
});
