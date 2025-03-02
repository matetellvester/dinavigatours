<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import MasonryCard from '../masonry-card.svelte';
	import { Button } from '../ui/button';
	import { MUNICIPALITIES } from '$lib/constants';
	import { ChevronLeft, Heart, Share2 } from 'lucide-svelte';
	import ViewedItem from './viewed-item.svelte';
	import { toast } from 'svelte-sonner';

	let open = $state(false);
	let hearted = $state(false);

	interface Props {
		items: ExploreItem[];
		showExploreMore?: boolean;
	}
	let { items, showExploreMore = false }: Props = $props();

	let itemSelected = $state<ExploreItem | null>(null);

	// console.log(items);
</script>

<div class="mt-10 space-x-2 px-4 pb-4 md:px-10 md:pb-8">
	{#each MUNICIPALITIES as municipality}
		<Button variant="outline" class="rounded-full px-2 py-0 text-xs capitalize">
			{municipality}
		</Button>
	{/each}
</div>

<div class="block flex-1">
	<h1
		class="bg-gradient-to-b from-transparent to-muted px-4 pb-4 text-3xl font-bold md:px-10 md:pb-8"
	>
		Explore
	</h1>

	<div class="bg-muted">
		<div class="columns-2 gap-4 px-4 md:columns-3 md:gap-6 md:px-10 lg:columns-4 lg:gap-8">
			{#each items as item}
				<MasonryCard
					{item}
					onclick={() => {
						itemSelected = item;
						open = true;
					}}
				/>
			{/each}
		</div>

		{#if showExploreMore}
			<div class="mt-4 flex justify-center pb-4">
				<Button variant="outline" href="/explore">Explore more...</Button>
			</div>
		{/if}
	</div>
</div>

<Sheet.Root bind:open>
	<Sheet.Content class="w-full overflow-auto p-0 sm:max-w-full [&>button]:hidden">
		<Sheet.Header>
			<Sheet.Title class="sticky top-0 z-10 flex bg-background px-3 py-2 text-left">
				<Button size="icon" class="[&_svg]:size-6" variant="ghost" onclick={() => (open = false)}>
					<ChevronLeft />
					<span class="sr-only">Go Back</span>
				</Button>
				<div class="ml-auto space-x-2">
					<Button
						size="icon"
						variant="ghost"
						class="[&_svg]:size-6"
						onclick={() => (hearted = !hearted)}
					>
						<Heart class=" transition-colors {hearted ? 'fill-red-500 stroke-red-500' : ''}" />
						<span class="sr-only">Heart</span>
					</Button>
					<Button
						size="icon"
						class="[&_svg]:size-6"
						variant="ghost"
						onclick={() => {
							navigator.clipboard.writeText('dfd');
							toast.success('Link copied to clipboard');
						}}
					>
						<Share2 />
						<span class="sr-only">Heart</span>
					</Button>
				</div>
			</Sheet.Title>
			<Sheet.Description>
				<ViewedItem item={itemSelected} />
			</Sheet.Description>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
