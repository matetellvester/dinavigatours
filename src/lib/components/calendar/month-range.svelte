<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '../ui/button/button.svelte';

	interface Props {
		button?: {
			class?: string;
		};
		onOpenChange?: (val: boolean) => void;
		onClick?: (val: string) => void;
		open?: boolean;
		selectedStartMonth?: string | null;
		selectedEndMonth?: string | null;
	}

	let {
		button,
		selectedStartMonth = $bindable(null),
		selectedEndMonth = $bindable(null),
		open = $bindable(false),
		onOpenChange,
		onClick
	}: Props = $props();

	function onclick(val: string) {
		onClick?.(val);
		// E reset ang value if the new value is same as selectedStartMonth
		if (val === selectedStartMonth) {
			selectedStartMonth = null;
			selectedEndMonth = null;
			return;
		}

		/**
		 * E set ang new value sa selectedStartMonth
		 * kung naa nay range na gi select,
		 * then e reset dayon ang value sa selectedEndMonth.
		 * In short, e reset ang values, and set new value to selectedStartMonth
		 */
		if (selectedEndMonth) {
			selectedStartMonth = val;
			selectedEndMonth = null;

			return;
		}

		/**
		 * E set ang new value to the selectedEndMonth
		 * kung naa nay value ang selectedStartMonth
		 */
		if (selectedStartMonth) {
			/**
			 * Kung ang new value is gamay kaysa selectedStartMonth
			 * e switch ilang value, para ang range is
			 * sakto na mag start from min to max
			 */
			if (Number(val) < Number(selectedStartMonth)) {
				selectedEndMonth = selectedStartMonth;
				selectedStartMonth = val;
				return;
			}

			/**
			 * E set a new value sa selectedEndMonth
			 * kung dako ang kini kaysa selectedStartMonth val
			 */
			selectedEndMonth = val;
			return;
		}

		// E set ang new value sa selectedStartMonth kung walay value ang selectedEndMonth
		selectedStartMonth = val;
	}

	const months = [
		{ name: 'Jan', value: '01' },
		{ name: 'Feb', value: '02' },
		{ name: 'Mar', value: '03' },
		{ name: 'Apr', value: '04' },
		{ name: 'May', value: '05' },
		{ name: 'Jun', value: '06' },
		{ name: 'Jul', value: '07' },
		{ name: 'Aug', value: '08' },
		{ name: 'Sep', value: '09' },
		{ name: 'Oct', value: '10' },
		{ name: 'Nov', value: '11' },
		{ name: 'Dec', value: '12' }
	];

	const monthsFull = [
		{ name: 'January', value: '01' },
		{ name: 'February', value: '02' },
		{ name: 'March', value: '03' },
		{ name: 'April', value: '04' },
		{ name: 'May', value: '05' },
		{ name: 'June', value: '06' },
		{ name: 'July', value: '07' },
		{ name: 'August', value: '08' },
		{ name: 'September', value: '09' },
		{ name: 'October', value: '10' },
		{ name: 'November', value: '11' },
		{ name: 'December', value: '12' }
	];
</script>

<Popover.Root bind:open {onOpenChange}>
	<Popover.Trigger
		class={buttonVariants({
			variant: 'outline',
			className: cn(
				'block w-full text-start text-muted-foreground hover:text-muted-foreground',
				button?.class
			)
		})}
	>
		{#if selectedStartMonth && selectedEndMonth}
			{monthsFull[Number(selectedStartMonth) - 1].name} - {monthsFull[Number(selectedEndMonth) - 1]
				.name}
		{:else if selectedStartMonth}
			{monthsFull[Number(selectedStartMonth) - 1].name}
		{:else}
			Select Month&lpar;s&rpar;
		{/if}
	</Popover.Trigger>
	<Popover.Content align="start" class="w-max px-2">
		<div class="grid grid-cols-4">
			{#each months as month}
				{@const isSelectedStartMonth = selectedStartMonth === month.value}
				{@const isSelectedEndMonth = selectedEndMonth === month.value}
				{@const hadMonths = selectedStartMonth !== null && selectedEndMonth !== null}
				{@const isRange =
					hadMonths &&
					Number(month.value) > (Number(selectedStartMonth) || 0) &&
					Number(month.value) < (Number(selectedEndMonth) || 0)}
				<button
					class="rounded p-2 text-sm transition-colors hover:bg-muted hover:text-accent-foreground data-[range=true]:rounded-none data-[end=true]:bg-primary data-[range=true]:bg-muted data-[start=true]:bg-primary"
					tabindex="-1"
					data-start={isSelectedStartMonth}
					data-end={isSelectedEndMonth}
					data-range={isRange}
					onclick={() => onclick(month.value)}>{month.name}</button
				>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
