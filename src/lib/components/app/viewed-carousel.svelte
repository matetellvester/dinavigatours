<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { getMediaSrc } from '$lib/utils';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { fade, scale } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';
	import Gallery from './explore/gallery.svelte';

	let api = $state<CarouselAPI>();
	let current = $state(0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	type Medias = Omit<Media, 'description' | 'copyright_link'>;

	let openGallery = $state(false);
	let imageGallery: Medias[] = $state([]);
	let currentMedia: Medias | null = $state(null);

	let { id }: { id: number } = $props();

	async function fetchMedia(): Promise<Medias[]> {
		const res = await fetch(`/api/lstng-media/${id}?lstng_id=${id}&columns=src,type,isThumbnail`);

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const result = await res.json();
		if (result.success) {
			return result.data as Medias[];
		} else {
			throw new Error(result.error || 'Unknown error occurred');
		}
	}

	let dataPromise = fetchMedia();
</script>

{#await dataPromise}
	<div class="flex space-x-2 px-5">
		<Skeleton class="aspect-video flex-1 rounded-lg" />
		<Skeleton class="aspect-video flex-1 rounded-lg max-md:hidden" />
		<Skeleton class="aspect-video flex-1 rounded-lg max-md:hidden" />
	</div>
{:then media}
	<div class="flex flex-1 flex-col px-1">
		<div class="mx-auto">
			<Carousel.Root
				setApi={(emblaApi) => (api = emblaApi)}
				class="relative w-full flex-1 px-2 md:px-0"
				opts={{
					align: 'center'
				}}
			>
				<Carousel.Content>
					{#each media as photo}
						<Carousel.Item
							role="button"
							onclick={() => {
								imageGallery = media;
								currentMedia = photo;
								openGallery = true;
							}}
							class="{media.length == 2
								? 'md:basis-1/2'
								: media.length > 2
									? 'md:basis-1/3'
									: ''} select-none"
						>
							<Card.Root class="relative translate-x-2 transition-transform">
								<Card.Content
									class="flex aspect-video items-center justify-center object-cover p-0"
								>
									<div class="absolute inset-0 flex items-end overflow-hidden rounded-lg"></div>
									<img
										src={getMediaSrc(photo.src)}
										alt="Dinavigatours Background"
										class="h-full w-full rounded-lg object-cover"
										loading="lazy"
									/>
								</Card.Content>
							</Card.Root>
						</Carousel.Item>
					{/each}
				</Carousel.Content>

				{#if media.length > 1}
					<div class="absolute bottom-1 left-6 px-2 py-2 text-center text-sm text-muted-foreground">
						<div class="flex justify-start space-x-2">
							{#each media as _, i}
								{@const currentItem = i + 1 == current}
								<button
									class="size-4 rounded-full border border-foreground transition-shadow
                          {currentItem ? 'bg-background' : 'bg-transparent'}"
									onclick={() => api?.scrollTo(i)}
								>
									<span class="sr-only">slide</span>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</Carousel.Root>
		</div>
	</div>
{/await}

{#if openGallery}
	<div
		transition:fade={{ duration: 70 }}
		class="fixed inset-0 z-20 flex cursor-default bg-black/80"
		role="button"
		tabindex="0"
		onclick={() => (openGallery = false)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') openGallery = false;
		}}
	>
		<div class="m-auto h-5/6 w-full max-w-5xl" transition:fade={{ delay: 70, duration: 100 }}>
			<Gallery bind:media={imageGallery} bind:currentMedia />
		</div>
	</div>
{/if}
