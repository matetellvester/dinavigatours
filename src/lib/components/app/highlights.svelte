<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { MapPin, Rss } from 'lucide-svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { onMount } from 'svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { getLocation, getThumbnail } from '$lib/utils';
	import { goto } from '$app/navigation';

	let api = $state<CarouselAPI>();
	let current = $state(0);

	const plugin = Autoplay({ delay: 5000, stopOnInteraction: true });

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	type RatingsWithUser = Rating & { user: UserName };

	type ListingWithMedia = {
		name: string;
		purok: string | null;
		municipality: string;
		bgry: string | null;
		media: Media[];
	};

	let highlights: RatingsWithUser[] | null = $state(null);

	const getHighestRating = (data: RatingsWithUser[]): RatingsWithUser[] | null => {
		if (data.length === 0) return null;

		// If the array has 3 or fewer items, return the original array
		if (data.length <= 3) return data;

		// Otherwise, find the item with the highest rating
		const highest = data.reduce((prev, current) => (current.rating > prev.rating ? current : prev));

		return [highest];
	};

	async function getData(lstng_id: number) {
		const res = await fetch(`/api/ltsng-basic-info/${lstng_id}?withMedia=true`);

		if (!res.ok) {
			console.error('Naay error sa pag kuha sa lsting info with id: ', lstng_id);
		}
		return (await res.json()).data as ListingWithMedia;
	}

	onMount(async () => {
		const res = await fetch('/api/ratings');

		if (!res.ok) {
			console.error('Naay error sa pag fetch sa ratings');
		}

		const data = (await res.json()).data as RatingsWithUser[];

		highlights = getHighestRating(data);
	});
</script>

{#if highlights !== null}
	{@const length = highlights.length}
	<h1
		class="md:mt-30 mt-2 block px-5 pb-4 font-poppins text-2xl font-bold tracking-tighter sm:mt-28 sm:text-2xl md:pb-5"
	>
		Highlights
	</h1>
	<div class="flex flex-1 flex-col">
		<div class="mx-auto">
			<Carousel.Root
				setApi={(emblaApi) => (api = emblaApi)}
				class="w-full flex-1 px-2 "
				plugins={[plugin]}
				opts={{
					align: 'center',
					loop: true
				}}
			>
				<Carousel.Content class="">
					{#each highlights as item}
						<Carousel.Item
							onclick={async () => {
								await goto('/?view=' + item.lstng_id);
							}}
							class="cursor-pointer {length == 2
								? 'sm:basis-1/2 md:basis-1/2'
								: length > 2
									? 'sm:basis-1/3 md:basis-1/3'
									: ''}"
						>
							<Card.Root class="relative translate-x-2 rounded-2xl transition-transform">
								<Card.Content
									class="flex aspect-video items-center justify-center rounded-2xl object-cover p-0"
								>
									{#await getData(item.lstng_id)}
										<div class="min-h-w-max aspect-video h-full rounded-2xl">
											<Skeleton class="size-full rounded-2xl" />
										</div>
									{:then d}
										<div
											class="absolute inset-0 flex items-end overflow-hidden rounded-2xl bg-gradient-to-t from-black/90 via-transparent to-transparent"
										>
											<div class="overflow-hidden p-5 md:p-3">
												<p class="truncate text-xl leading-tight text-white">{d.name}</p>
												<p
													class="flex w-full items-center space-x-1 overflow-hidden text-nowrap text-xs text-white/50"
												>
													<MapPin class="size-6 md:size-4" />
													<span class="truncate text-sm capitalize"
														>{getLocation({ municipality: d.municipality, bgry: d.bgry })}</span
													>
												</p>
											</div>
										</div>
										<img
											src={getThumbnail(d.media)}
											alt="some detail"
											class="h-full w-full rounded-2xl object-cover"
											loading="lazy"
										/>
									{/await}
								</Card.Content>
							</Card.Root>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
			</Carousel.Root>
		</div>
		<div class="py-2 text-center text-sm text-muted-foreground">
			<div class="flex justify-center space-x-2">
				{#each highlights as _, i}
					{@const currentItem = i + 1 == current}
					<button
						class="size-4 rounded-full border ring-foreground transition-shadow
            {currentItem ? 'ring-2' : 'ring-0'}"
						onclick={() => api?.scrollTo(i)}
					>
						<span class="sr-only">slide</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="md:mt-30 mt-2 w-full sm:mt-28"></div>
{/if}
