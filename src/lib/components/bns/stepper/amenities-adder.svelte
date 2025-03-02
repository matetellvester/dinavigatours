<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { CirclePlus, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		/**
		 * Gamiton para sa `name attribute`, form submission
		 */
		dataName: string;
		adder: {
			/**
			 * Kung gusto nimo naay label na mo show before the adder component
			 */
			label?: string;
			/**
			 * Ang `id` na gamiton for the input element where the user enter amenities. But this will only work if you pass a prop `label`.
			 */
			id?: string;

			/**
			 * Ang placeholder sa `adder` if there is no value selected
			 */
			placeholder: string;
		};

		numberedList?: boolean;
	}

	let { dataName, adder, numberedList }: Props = $props();

	let amenities: { id: number; name: string }[] = $state([]);
	let adderValue = $state('');
	let adderEl: HTMLInputElement | null = null;
	let empty = $derived(adderValue.trim() == '');
	const adderId = adder.id ?? Math.random().toString(36).substring(2, 15);
	let id = 1;

	onMount(() => {
		adderEl = document.getElementById(adderId) as HTMLInputElement;
	});

	function remove(id: number) {
		amenities = amenities.filter((p) => p.id !== id);
	}
</script>

<div>
	{#if adder.label}
		<div class="mb-2"><Label for={adderId}>{adder.label}</Label></div>
	{/if}

	<!-- opacity-60 hover:opacity-100 -->
	<div class="flex space-x-2">
		<Input id={adderId} bind:value={adderValue} placeholder={adder.placeholder}></Input>
		<Button
			class="px-2 py-1 [&_svg]:size-6 "
			type="button"
			variant="ghost"
			disabled={empty}
			onclick={() => {
				amenities.push({ id: id++, name: adderValue });
				adderValue = '';
				adderEl?.focus();
			}}><CirclePlus class="transition-opacity {empty ? 'opacity-60' : 'opacity-100'}" /></Button
		>
	</div>

	<div class="mt-4 space-y-2 pl-4">
		{#each amenities as { name, id }, i}
			<div class="flex items-center" in:fade={{ duration: 150 }} out:fly={{ duration: 150, x: 5 }}>
				{#if numberedList}
					<span
						class="mr-2 flex size-[6px] -translate-x-[0.150rem] items-center justify-center text-xs"
						>{i + 1}</span
					>
				{:else}
					<span class="mr-2 size-[6px] -translate-x-[0.150rem] rounded-full bg-muted-foreground/40"
					></span>
				{/if}

				<Input
					class="pointer-events-none h-6 py-0.5 text-xs"
					type="text"
					value={name}
					aria-label="add amenities"
					name={`${dataName}[${i}]`}
				/>

				<button
					type="button"
					class="ml-1 flex w-12 p-1 text-center opacity-60 hover:opacity-100"
					onclick={() => remove(id)}
				>
					<X class="m-auto size-4" />
				</button>
			</div>
		{/each}
	</div>
</div>
