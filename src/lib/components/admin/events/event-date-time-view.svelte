<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import {
		formatOneTimeEvent,
		formatMonthlyEvent,
		formatYearlyEvent,
		formatTimeRangeEvent
	} from '$lib/utils';
	import { Clock3 } from 'lucide-svelte';

	let { event }: { event: Event } = $props();
</script>

<div class="align-baseline">
	{#if event.type === 'one_time'}
		{formatOneTimeEvent(event.start_datetime, event.end_datetime)}
	{/if}

	{#if event.type === 'monthly'}
		{formatMonthlyEvent(event.month, event.day_range)}
	{/if}

	{#if event.type === 'yearly'}
		{formatYearlyEvent(event.month, event.day_range)}
	{/if}

	{#if event.time_type !== null}
		<Clock3 class="ml-2 inline size-4 -translate-y-0.5" />
		{@render timeType(event.time_type)}
		{formatTimeRangeEvent(event.time_type, event.start_time, event.end_time)}
	{/if}
</div>

{#snippet timeType(time_type: 'default' | 'whole_day' | '24_Hour')}
	{#if time_type !== 'default'}
		<Badge variant="outline" class="rounded-sm">
			{time_type === 'whole_day' ? 'Whole day' : '24 Hour'}</Badge
		>
	{/if}
{/snippet}
