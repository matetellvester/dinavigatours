<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { idTypes } from '$lib/constants';
	import { onMount } from 'svelte';

	const validids = idTypes;

	let { type = $bindable(''), inputValue = $bindable('') }: { type: string; inputValue?: string } =
		$props();

	const triggerContent = $derived(
		validids.find((f) => f.value === type)?.label ?? 'Select ID Type'
	);

	onMount(() => {
		if (!type) return;
		type = type;
	});
</script>

<span
	class="text-sm font-medium leading-7 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	>ID Number</span
>
<div class="flex">
	<Input
		class="rounded-e-none border-e-0"
		name="idNum"
		type="text"
		bind:value={inputValue}
		required
		placeholder="Number"
		autocomplete="off"
	/>

	<Select.Root type="single" bind:value={type}>
		<Select.Trigger class="relative w-[240px] rounded-s-none">
			{triggerContent}
			<input
				type="text"
				name="idType"
				bind:value={type}
				required
				class="pointer-events-none absolute inset-0 opacity-0"
			/>
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each validids as id}
					<Select.Item value={id.value} label={id.label} />
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
