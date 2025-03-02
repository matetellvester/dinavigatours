<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { getThumbnail } from '$lib/utils';
	import { MapPin } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import Button from '../ui/button/button.svelte';
	import ViewedEvent from './viewed-event.svelte';

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

	let open = $state(false);

	let currentOpen = $state<EventWithMedia | null>(null);

	function getMonthName(month: string): string {
		const monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];

		const monthIndex = parseInt(month, 10) - 1; // Convert to zero-based index
		return monthNames[monthIndex] || 'Invalid month';
	}

	function getFirstDay(day: string): string {
		// Split the string by "-" and take the first part
		const firstDay = day.split('-')[0];
		return firstDay;
	}

	type EventWithMedia = Event & { media: Media[] };
	let eventList: EventWithMedia[] | null = $state(null);

	async function fetchEvents() {
		try {
			const response = await fetch('/api/events?getMedia=true');
			if (!response.ok) {
				throw new Error('Failed to fetch events');
			}
			const events = await response.json();
			return events;
		} catch (error) {
			console.error('Error fetching events:', error);
			return [];
		}
	}

	onMount(async () => {
		const events = await fetchEvents();
		if (events.success) {
			eventList = events.data;
		}
	});
</script>

<div>
	<h1 class="mt-4 px-4 pb-4 font-poppins text-2xl font-bold tracking-tighter sm:text-2xl md:pb-8">
		Events
	</h1>
	<div class="relative min-h-[250px] w-full overflow-hidden object-cover">
		<img
			src="/images/5c35d4a8cb2c4a44acf44a7a3741ebaf292602.png"
			alt=""
			class="h-full min-h-[250px] w-full object-cover object-[-25px_100%] md:object-left-bottom"
		/>

		<div class="absolute inset-0 flex h-full p-4 pr-0">
			<div class="mt-auto py-2 text-center text-sm text-muted-foreground">
				<div class="flex justify-center space-x-2">
					{#if eventList}
						{#each eventList.slice(0, 5) as _, i}
							{@const currentItem = i + 1 == current}
							<button
								class="size-3 rounded-full border transition-shadow
                {currentItem ? 'bg-foreground ring-2 ring-foreground' : 'ring-2 ring-foreground'}"
								onclick={() => api?.scrollTo(i)}
							>
								<span class="sr-only">slide</span>
							</button>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Content -->
			<div class="ml-auto flex basis-48 sm:basis-2/3">
				<!-- {@render cards()} -->
				<div class="flex flex-1 flex-col">
					<div class="mx-auto h-full">
						<Carousel.Root
							setApi={(emblaApi) => (api = emblaApi)}
							class="flex h-full w-full flex-1 px-2 sm:px-4 sm:py-2"
							opts={{
								align: 'center'
							}}
						>
							<Carousel.Content class="h-full ">
								{#if eventList}
									{#each eventList as e}
										{@const src = getThumbnail(e.media)}

										<Carousel.Item
											class="cursor-pointer md:basis-1/2"
											onclick={async () => {
												currentOpen = e;

												await tick();
												open = true;
											}}
										>
											<Card.Root
												class="relative h-full translate-x-2 break-inside-avoid  rounded-2xl border-none shadow-sm transition-transform  md:mb-6 lg:mb-8"
											>
												<Card.Content
													class="flex h-full flex-col items-center justify-center object-cover p-0"
												>
													<div class="relative h-full w-full rounded-2xl">
														<div
															class="absolute inset-0 flex h-full w-full flex-col items-start justify-start overflow-hidden rounded-2xl bg-gradient-to-t from-black/90 via-transparent to-transparent p-2 md:p-4"
														>
															{@render calendar(e)}
															<div class="mt-auto w-full text-left leading-4 text-white">
																<span class="block md:text-xl">{e.name}</span>
																<span
																	class="flex items-center text-sm capitalize text-muted-foreground"
																	><MapPin class="mr-1 size-4" />{e.municipality +
																		(e.bgry ? `, ${e.bgry}` : '')}</span
																>
															</div>
														</div>
														<img
															{src}
															alt="Dinavigatours Background"
															class="h-full w-full rounded-2xl object-cover"
														/>
													</div>
												</Card.Content>
											</Card.Root>
										</Carousel.Item>
									{/each}
								{/if}
							</Carousel.Content>
						</Carousel.Root>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

{#if eventList && eventList.length > 5}
	<div class="mt-4 flex px-4">
		<Button href="/events" size="sm" variant="outline" class="mx-auto">See More Events</Button>
	</div>
{/if}

{#snippet calendar(e: EventWithMedia)}
	{#if e.month}
		<div
			class="relative flex aspect-square flex-col items-center justify-center rounded-md bg-background p-1 font-poppins shadow-xl sm:h-14"
		>
			<div
				class="absolute left-0 right-0 top-0 flex h-3 justify-around rounded-t-md border-b-2 bg-primary sm:h-4"
			>
				<span class="ml-1 h-2 w-1 -translate-y-0.5 rounded-full bg-foreground"></span>
				<span class="mr-1 h-2 w-1 -translate-y-0.5 rounded-full bg-foreground"></span>
			</div>

			<span class="mt-2 scale-75 leading-4 sm:scale-100">{getMonthName(e.month)}</span>
			<span class="font-bold leading-3">{getFirstDay(e.day_range)}</span>
		</div>
	{/if}
{/snippet}

<ViewedEvent bind:open event={currentOpen} />
