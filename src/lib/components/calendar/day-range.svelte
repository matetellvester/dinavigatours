<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '../ui/button/button.svelte';

	interface Props {
		button?: {
			class?: string;
		};
		onOpenChange?: (val: boolean) => void;
		open?: boolean;
		startVal?: number | null;
		endVal?: number | null;
	}

	let {
		button,
		startVal = $bindable(null),
		endVal = $bindable(null),
		open = $bindable(false),
		onOpenChange
	}: Props = $props();

	function onclick(value: number) {
		// E reset ang value if the new value is same as startVal
		if (value === startVal) {
			startVal = null;
			endVal = null;
			return;
		}

		/**
		 * E set ang new value sa startVal
		 * kung naa nay range na gi select,
		 * then e reset dayon ang value sa endVal.
		 * In short, e reset ang values, and set new value to startVal
		 */
		if (endVal) {
			startVal = value;
			endVal = null;
			return;
		}

		/**
		 * E set ang new value to the endVal
		 * kung naa nay value ang startVal
		 */
		if (startVal) {
			/**
			 * Kung ang new value is gamay kaysa startVal
			 * e switch ilang value, para ang range is
			 * sakto na mag start from min to max
			 */
			if (value < startVal) {
				endVal = startVal;
				startVal = value;
				return;
			}

			/**
			 * E set a new value sa endVal
			 * kung dako ang kini kaysa start val
			 */
			endVal = value;
			return;
		}

		// E set ang new value sa startVal kung walay value ang endVal
		startVal = value;
	}
</script>

<Popover.Root {onOpenChange} bind:open>
	<Popover.Trigger
		class={buttonVariants({
			variant: 'outline',
			className: cn(
				'block w-full text-start text-muted-foreground hover:text-muted-foreground',
				button?.class
			)
		})}
	>
		{#if startVal && endVal}
			{startVal} - {endVal}
		{:else if startVal}
			{startVal}
		{:else}
			Select Day&lpar;s&rpar;
		{/if}
	</Popover.Trigger>
	<Popover.Content align="start" class="px-2">
		<div class="grid grid-cols-7">
			{#each Array.from({ length: 31 }, (_, i) => i + 1) as day}
				{@const isStartDateSame = startVal === day}
				{@const isEndDateSame = endVal === day}
				{@const hadDates = startVal !== null && endVal !== null}
				{@const isRange = hadDates && day > (startVal || 0) && day < (endVal || 0)}
				<button
					class="rounded px-1 py-2 text-sm transition-colors hover:bg-muted hover:text-accent-foreground data-[range=true]:rounded-none data-[end=true]:bg-primary data-[range=true]:bg-muted data-[start=true]:bg-primary"
					data-start={isStartDateSame}
					data-end={isEndDateSame}
					data-range={isRange}
					onclick={() => onclick(day)}
					tabindex="-1"
				>
					{day}
				</button>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
