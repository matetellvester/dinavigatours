<script lang="ts" generics="T extends readonly string[]">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		choices: T;
		value?: T[number];
		onChange?: (value: T[number]) => void;
	}

	let { choices, value = $bindable(), onChange }: Props = $props();

	let radioValue: string = $state('');

	function onclick(newValue: T[number]) {
		value = newValue;
		onChange?.(newValue);
	}
</script>

<RadioGroup.Root bind:value={radioValue}>
	<div class="flex flex-wrap space-x-2 space-y-2">
		{#each choices as name, i}
			{@render radio(name, i)}
		{/each}
	</div>
</RadioGroup.Root>

{#snippet radio(name: string, index: number)}
	<RadioGroup.Item
		id={name + index}
		value={name}
		{name}
		class="inset-0 size-[1px] select-none opacity-0"
	/>

	<Label for={name + index} class="sr-only">{name}</Label>
	<Button
		class="rounded-full  capitalize"
		variant={value === name ? 'default' : 'outline'}
		onclick={() => onclick(name)}
	>
		{name}
	</Button>
{/snippet}
