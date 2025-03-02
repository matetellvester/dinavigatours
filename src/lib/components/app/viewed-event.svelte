<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { isDesktop } from '$lib/hooks/is-mobile.svelte';
	import {
		formatMonthlyEvent,
		formatOneTimeEvent,
		formatTimeRangeEvent,
		formatYearlyEvent,
		getMediaSrc
	} from '$lib/utils';

	interface Props {
		open: boolean;
		event: (Event & { media: Media[] }) | null;
	}

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

	let {
		open = $bindable(false),

		event: e
	}: Props = $props();
</script>

{#snippet carousel()}
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
					{#if e}
						{#each e.media as { src, type }}
							<Carousel.Item>
								<Card.Root class="relative translate-x-2 transition-transform">
									<Card.Content
										class="flex aspect-video items-center justify-center object-cover p-0"
									>
										<div class="absolute inset-0 flex items-end overflow-hidden rounded-lg"></div>
										<img
											src={getMediaSrc(src)}
											alt="Dinavigatours Background"
											class="h-full w-full rounded-lg object-cover"
											loading="lazy"
										/>
									</Card.Content>
								</Card.Root>
							</Carousel.Item>
						{/each}
					{/if}
				</Carousel.Content>

				{#if e}
					{#if e.media.length > 1}
						<div
							class="absolute bottom-1 left-6 px-2 py-2 text-center text-sm text-muted-foreground"
						>
							<div class="flex justify-start space-x-2">
								{#each e.media as _, i}
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
				{/if}
			</Carousel.Root>
		</div>
	</div>
{/snippet}

{#if isDesktop.current}
	<Dialog.Root bind:open>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="pt-4">
					{@render carousel()}
				</Dialog.Title>
				<Dialog.Description
					class="mt-8 font-poppins text-xl font-bold tracking-tight text-foreground"
				>
					<div class="py-2">{@render eventName()}</div>
				</Dialog.Description>
			</Dialog.Header>
			<div class="leading-5 text-muted-foreground">
				{@render description()}
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Content>
			<Drawer.Header class="p-0 pt-4 text-left">
				<Drawer.Title>
					{@render carousel()}
				</Drawer.Title>
				<Drawer.Description class="font-poppins text-xl font-bold tracking-tight text-foreground">
					<div class="px-4 py-2">{@render eventName()}</div>
				</Drawer.Description>
			</Drawer.Header>
			<div class="px-4 leading-5 text-muted-foreground">
				{@render description()}
			</div>
			<Drawer.Footer class="pt-8">
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Close</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}

{#snippet description()}
	{#if e}
		{e.description}
	{/if}
{/snippet}

{#snippet eventName()}
	{#if e}
		{e.name}
		<div class="align-baseline text-xs font-medium text-muted-foreground">
			{#if e.type === 'one_time'}
				{formatOneTimeEvent(e.start_datetime, e.end_datetime)}
			{/if}

			{#if e.type === 'monthly'}
				{formatMonthlyEvent(e.month, e.day_range)}
			{/if}

			{#if e.type === 'yearly'}
				{formatYearlyEvent(e.month, e.day_range)}
			{/if}

			{#if e.time_type !== null}
				<br />

				{@render timeType(e.time_type)}
				{formatTimeRangeEvent(e.time_type, e.start_time, e.end_time)}
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet timeType(time_type: 'default' | 'whole_day' | '24_Hour')}
	{#if time_type !== 'default'}
		<Badge variant="outline" class="rounded-sm">
			{time_type === 'whole_day' ? 'Whole day' : '24 Hour'}</Badge
		>
	{/if}
{/snippet}
