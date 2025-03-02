<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { ChevronLeft, Share2 } from 'lucide-svelte';
	import MasonryCard from '../masonry-card.svelte';
	import { Button } from '../ui/button';
	import ViewedItem from './viewed-item.svelte';

	// import { toast } from 'svelte-sonner';

	let open = $state(false);
	let hearted = $state(false);

	interface Props {
		items: (ExploreItem & { can_book: boolean })[];
		showExploreMore?: boolean;
	}
	let { items, showExploreMore = false }: Props = $props();

	// let itemSelected = $state<ExploreItem | null>(null);

	$effect(() => {
		open = !!$page.url.searchParams.get('view');
	});
</script>

<div class="mt-10 block flex-1">
	<h1
		class="{showExploreMore
			? 'bg-gradient-to-b from-transparent to-muted'
			: ''} px-4 pb-4 font-poppins text-2xl font-bold tracking-tighter sm:text-2xl md:px-10 md:pb-8 xl:px-0"
	>
		Explore
	</h1>

	<div class:bg-muted={showExploreMore}>
		<div
			class="w-full columns-2 gap-4 px-4 md:columns-3 md:gap-6 md:px-10 lg:columns-4 lg:gap-8 xl:px-6"
		>
			{#each items as item}
				<MasonryCard
					{item}
					onclick={async () => {
						await goto(`${$page.url.pathname}?view=${item.id}`, {
							replaceState: false,
							noScroll: true
						});
					}}
				/>
			{/each}
		</div>

		{#if showExploreMore}
			<div class="mt-4 flex justify-center px-4 pb-4">
				<Button variant="outline" href="/explore">Explore more...</Button>
			</div>
		{/if}
	</div>
</div>

<Sheet.Root bind:open>
	<Sheet.Content
		class="w-full overflow-auto p-0 sm:max-w-full [&>button]:hidden"
		data-sheet-scroll-section
	>
		<Sheet.Header>
			<Sheet.Title class="sticky top-0 z-10  bg-background px-3 py-2 text-left">
				<div class="mx-auto flex max-w-5xl">
					<Button
						size="icon"
						class="[&_svg]:size-6"
						variant="ghost"
						onclick={() => {
							window.history.back();
						}}
					>
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
							<!-- <Heart class=" transition-colors {hearted ? 'fill-red-500 stroke-red-500' : ''}" />
						<span class="sr-only">Heart</span> -->
						</Button>
						<Button
							size="icon"
							class="[&_svg]:size-6"
							variant="ghost"
							onclick={() => {
								navigator.share({
									title: 'Dinavigatours',
									text: 'Check out this amazing tour app!',
									url: `https://dinavigatours.vercel.app/?view=${$page.url.searchParams.get('view')}`
								});
							}}
						>
							<Share2 />
							<span class="sr-only">share</span>
						</Button>
					</div>
				</div>
			</Sheet.Title>
			<Sheet.Description>
				<div class="mx-auto max-w-5xl">
					<ViewedItem />
				</div>
			</Sheet.Description>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
