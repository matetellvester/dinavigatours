<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { getLocation, getThumbnail } from '$lib/utils';
	import { MapPin, Star } from 'lucide-svelte';

	let { item, onclick }: { item: ExploreItem; onclick?: () => void } = $props();

	// function getLocation() {
	// 	const bgry = item.bgry ? `, ${item.bgry}` : '';
	// 	return item.municipality + bgry;
	// }

	function getSrc(src: string) {
		return 'https://kbbbgnhqlxvswspelkmu.supabase.co/storage/v1/object/public/' + src;
	}
</script>

{#snippet location(location: string)}
	<div class="overflow-hidden px-3 pb-2 md:px-4 md:pb-3">
		<p
			class="inline-flex w-full items-center space-x-1 overflow-hidden text-nowrap text-sm text-white"
		>
			<MapPin size={15} class="" />
			<span class="truncate">{location}</span>
		</p>
	</div>
{/snippet}

{#snippet rating({ average, count }: NonNullable<ExploreItem['rating']>)}
	<p class=" inline-flex items-center space-x-1 text-nowrap text-yellow-500">
		<Star class="fill-yellow-500" size="15" />
		<span>{average}/5</span>
		<span class="text-muted-foreground">&lpar;{count}&rpar;</span>
	</p>
{/snippet}

<button
	class="block focus-visible:outline-none focus-visible:ring focus-visible:ring-primary"
	onclick={() => onclick?.()}
>
	<Card.Root
		class="mb-4 break-inside-avoid rounded-2xl shadow-sm transition-transform md:mb-6 lg:mb-8"
	>
		<Card.Content class="flex aspect-video flex-col items-center justify-center object-cover p-0">
			<div class="relative w-full">
				<div
					class="absolute inset-0 flex items-end overflow-hidden rounded-t-2xl bg-gradient-to-t from-black/90 via-transparent to-transparent capitalize"
				>
					{@render location(getLocation({ municipality: item.municipality, bgry: item.bgry }))}
				</div>

				<img
					src={getThumbnail(item.media)}
					loading="lazy"
					alt=""
					class="h-auto w-full rounded-t-2xl object-cover"
				/>
			</div>
		</Card.Content>
		<Card.Footer class="w-full flex-col items-start px-3 py-3 md:px-5 md:py-4">
			<p
				class="mb-1 w-full text-start font-poppins text-sm font-semibold leading-none tracking-tight"
			>
				{item.name}
			</p>
			{#if item.rating}
				{@render rating(item.rating)}
			{/if}

			{#if item.rate}
				<p class="text-xs leading-normal text-muted-foreground">
					From &#8369;{item.rate}
				</p>
			{/if}
		</Card.Footer>
	</Card.Root>
</button>
