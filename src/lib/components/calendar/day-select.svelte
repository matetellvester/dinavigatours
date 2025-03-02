<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '../ui/button/button.svelte';

	type NumRange =
		| 1
		| 2
		| 3
		| 4
		| 5
		| 6
		| 7
		| 8
		| 9
		| 10
		| 11
		| 12
		| 13
		| 14
		| 15
		| 16
		| 17
		| 18
		| 19
		| 20
		| 21
		| 22
		| 23
		| 24
		| 25
		| 26
		| 27
		| 28
		| 29
		| 30
		| 31;

	interface Props {
		btn?: {
			class?: string;
			placeholder?: string;
		};
		min?: NumRange;
		open?: boolean;
		selectedDay?: number | null;
		month: number | null;
		onOpenChange?: (val: boolean) => void;
		onClick?: (val: number) => void;
	}

	const monthNames = [
		'',
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	let {
		btn,
		month,
		min,
		open = $bindable(false),
		selectedDay = $bindable(null),
		onClick,
		onOpenChange
	}: Props = $props();

	function onclick(val: number) {
		onClick?.(val);
		selectedDay = val;
	}
</script>

<Popover.Root bind:open {onOpenChange}>
	<Popover.Trigger
		class={buttonVariants({
			variant: 'outline',
			className: cn(
				'block w-full text-start text-muted-foreground hover:text-muted-foreground',
				btn?.class
			)
		})}
		disabled={!month}
	>
		{#if !month}
			{btn?.placeholder || 'No month selected'}
		{/if}

		{#if month && !selectedDay}
			Select Day
		{:else}
			{selectedDay}
		{/if}
	</Popover.Trigger>
	<Popover.Content align="start" class="px-2">
		<div class="mb-4 px-3 text-sm font-semibold capitalize text-muted-foreground">
			{month && monthNames[month]}
		</div>
		<div class="grid grid-cols-7 gap-0.5">
			{#each Array.from({ length: 31 }, (_, i) => i + 1) as day}
				{@const isSelected = selectedDay === day}
				<button
					class="rounded px-1 py-2 text-sm transition-colors hover:bg-muted hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[selected=true]:bg-primary"
					tabindex="-1"
					disabled={min ? min >= day : false}
					data-selected={isSelected}
					onclick={() => onclick(day)}>{day}</button
				>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
