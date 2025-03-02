<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { cn, formatDate, getMediaSrc } from '$lib/utils';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import Autoplay from 'embla-carousel-autoplay';
	import { Quote, Star } from 'lucide-svelte';

	let ratings: (Rating & { user: { last_name: string; first_name: string } })[] | null =
		$state(null);
	let api = $state<CarouselAPI>();
	let current = $state(0);
	const plugin = Autoplay({ delay: 2500, stopOnInteraction: false, stopOnFocusIn: true });

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	function getClass(arr: any[]) {
		if (arr.length === 1) {
			return '';
		}
		if (arr.length > 2) {
			if (arr.length === 2) {
				return 'basis-1/2';
			}
			return 'sm:basis-1/2 md:basis-1/3';
		}
	}

	onMount(async () => {
		try {
			const response = await fetch('/api/ratings');
			if (response.ok) {
				ratings = (await response.json()).data as (Rating & {
					user: { last_name: string; first_name: string };
				})[];
			} else {
				console.error('Failed to fetch ratings');
			}
		} catch (error) {
			console.error('Error fetching ratings:', error);
		}
	});
</script>

{#if ratings !== null}
	<div class="relative px-0 pb-8 pt-8 sm:px-4 xl:px-0">
		<div class="mb-8 flex w-full justify-center">
			<h1 class="font-poppins text-xl font-semibold">
				What Our <span class="text-primary">Travelers</span> Say
			</h1>
		</div>

		<div class="flex flex-1 flex-col px-1">
			<div class="mx-auto">
				<Carousel.Root
					setApi={(emblaApi) => (api = emblaApi)}
					class="relative w-full flex-1 rounded-2xl px-2 md:px-0"
					plugins={[plugin]}
					opts={{
						align: 'center',
						loop: true
					}}
				>
					<Carousel.Content>
						{#each ratings as rating}
							<Carousel.Item class={cn(getClass(ratings))}>
								<Card.Root class="relative translate-x-2 rounded-2xl transition-transform">
									<Card.Content
										class="flex aspect-video items-start justify-center object-cover p-0"
									>
										<div class="relative w-full text-wrap p-4">
											<div
												class="top- absolute left-0 right-0 flex items-center justify-between px-4 pt-2"
											>
												<Quote class="scale-x-[-1] transform text-muted-foreground" />

												<div class="flex space-x-1">
													{@render star(rating.rating)}
												</div>
											</div>
											<div class="text-wrap pt-12">
												<div class="relative overflow-hidden pb-2 max-sm:max-h-[300px]">
													<div
														class="absolute inset-0 bg-gradient-to-t from-background from-5% to-transparent to-50%"
													></div>
													{rating.rating_content}
												</div>

												<div class="pt-4 text-sm text-muted-foreground">
													<span>
														{rating.user.first_name}
														{rating.user.last_name} - {formatDate(rating.created_at, true)}
													</span>
												</div>
											</div>
										</div>
									</Card.Content>
								</Card.Root>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
				</Carousel.Root>
			</div>
		</div>

		<div
			class="absolute bottom-0 left-0 right-0 -z-10 h-1/2 w-full bg-[url('/wave_blue_pattern.png')] bg-contain bg-bottom bg-repeat-x opacity-30"
			role="img"
		></div>
	</div>
{/if}

{#snippet star(count: number)}
	<div class="flex space-x-1 max-md:space-x-0.5">
		{#each Array.from({ length: 5 }) as _, i}
			{#if i + 1 <= count}
				<Star class="fill-yellow-500 stroke-yellow-500 max-md:size-4" />
			{:else}
				<Star class="max-md:size-4" />
			{/if}
		{/each}
	</div>
{/snippet}
