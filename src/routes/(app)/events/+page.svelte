<script lang="ts">
	import ViewedEvent from '$lib/components/app/viewed-event.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		formatMonthlyEvent,
		formatOneTimeEvent,
		formatTimeRangeEvent,
		formatYearlyEvent,
		getThumbnail
	} from '$lib/utils';
	import { onMount, tick } from 'svelte';

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

	type EventWithMedia = Event & { media: Media[] };
	let open = $state(false);

	function splitEventsByUpcoming(events: EventWithMedia[]): [EventWithMedia[], EventWithMedia[]] {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
		const currentDay = currentDate.getDate();

		const notUpcoming: EventWithMedia[] = [];
		const upcoming: EventWithMedia[] = [];

		events.forEach((event) => {
			const [eventMonth] = event.month.split('-').map(Number); // Use only the start month
			const [eventDay] = event.day_range.split('-').map(Number); // Use only the start day

			if (eventMonth === currentMonth && eventDay >= currentDay) {
				upcoming.push(event);
			} else {
				notUpcoming.push(event);
			}
		});

		return [notUpcoming, upcoming];
	}

	let currentOpen = $state<EventWithMedia | null>(null);

	let eventsList: EventWithMedia[] = $state([]);
	let upcomingEventsList: EventWithMedia[] = $state([]);

	onMount(async () => {
		const events = await fetchEvents();

		if (events.success) {
			const [notUpcoming, upcoming] = splitEventsByUpcoming(events.data);

			upcomingEventsList = upcoming;
			eventsList = notUpcoming;
		}
	});
</script>

<svelte:head>
	<title>Events</title>
</svelte:head>

<div class="mt-10 block flex-1 max-md:pb-20">
	<h1
		class=" px-4 pb-4 font-poppins text-2xl font-bold tracking-tighter sm:text-2xl md:px-10 md:pb-8 xl:px-0"
	>
		Events
	</h1>

	{#if upcomingEventsList.length}
		<h2
			class="px-4 pb-4 font-poppins text-lg font-bold tracking-tighter text-muted-foreground md:px-10 md:pb-8 xl:px-0"
		>
			Upcoming this month
		</h2>
		<div
			class="w-full columns-2 gap-4 px-4 md:columns-3 md:gap-6 md:px-10 lg:columns-4 lg:gap-8 xl:px-6"
		>
			{#each upcomingEventsList as event}
				{@render card(event)}
			{/each}
		</div>

		<h2
			class="px-4 pb-4 font-poppins text-lg font-bold tracking-tighter text-muted-foreground md:px-10 md:pb-8 xl:px-0"
		>
			All events
		</h2>
	{/if}

	<div
		class="w-full columns-2 gap-4 px-4 md:columns-3 md:gap-6 md:px-10 lg:columns-4 lg:gap-8 xl:px-6"
	>
		{#each eventsList as event}
			{@render card(event)}
		{/each}
	</div>
</div>

{#snippet card(e: EventWithMedia)}
	{@const src = getThumbnail(e.media)}
	<button
		onclick={async () => {
			currentOpen = e;

			await tick();
			open = true;
		}}
		class="block focus-visible:outline-none focus-visible:ring focus-visible:ring-primary"
	>
		<Card.Root
			class="mb-4 break-inside-avoid rounded-2xl shadow-sm transition-transform md:mb-6 lg:mb-8"
		>
			<Card.Content class="flex aspect-video flex-col items-center justify-center object-cover p-0">
				<div class="relative w-full">
					<div
						class="absolute inset-0 flex items-end overflow-hidden rounded-t-2xl bg-gradient-to-t from-black/90 via-transparent to-transparent capitalize text-white"
					>
						<!-- Basilisa, Coring -->
					</div>
					<img {src} loading="lazy" alt="" class="h-auto w-full rounded-t-2xl object-cover" />
				</div>
			</Card.Content>
			<Card.Footer class="w-full flex-col items-start px-3 py-3 md:px-5 md:py-4">
				<p
					class="mb-1 w-full text-start font-poppins text-sm font-semibold leading-none tracking-tight"
				>
					{e.name}
				</p>

				<div class="text-left align-baseline text-xs text-muted-foreground">
					{#if e.type === 'one_time'}
						{formatOneTimeEvent(e.start_datetime, e.end_datetime)}
					{/if}

					{#if e.type === 'monthly'}
						{formatMonthlyEvent(e.month, e.day_range)}
					{/if}

					{#if e.type === 'yearly'}
						{formatYearlyEvent(e.month, e.day_range)}
					{/if}

					{#if e.time_type !== null && e.start_time !== '00:00'}
						<br />
						<!-- <Clock3 class="ml-2 inline size-4 -translate-y-0.5" /> -->
						{@render timeType(e.time_type)}
						{formatTimeRangeEvent(e.time_type, e.start_time, e.end_time)}
					{/if}
				</div>
			</Card.Footer>
		</Card.Root>
	</button>
{/snippet}

{#snippet timeType(time_type: 'default' | 'whole_day' | '24_Hour')}
	{#if time_type !== 'default'}
		<Badge variant="outline" class="rounded-sm">
			{time_type === 'whole_day' ? 'Whole day' : '24 Hour'}</Badge
		>
	{/if}
{/snippet}

<ViewedEvent bind:open event={currentOpen} />
