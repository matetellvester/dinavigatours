<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		choices: Bgry[] | readonly string[];
		value: string;
	}
	let { choices, value = $bindable() }: Props = $props();
</script>

{#snippet radio(name: string, index: number)}
	<RadioGroup.Item id={name + index} value={name} {name} class="inset-0 size-0 opacity-0" />

	<Label for={name + index} class="sr-only">{name}</Label>
	<Button
		class="rounded-full  capitalize"
		variant={value === name ? 'default' : 'outline'}
		onclick={() => (value = name)}
	>
		{name}
	</Button>
{/snippet}

{#if Array.isArray(choices) && choices.every((item) => typeof item === 'string')}
	<RadioGroup.Root bind:value>
		<div class="flex flex-wrap space-x-2 space-y-2">
			{#each choices as name, i}
				{@render radio(name, i)}
			{/each}
		</div>
	</RadioGroup.Root>
{:else}
	<RadioGroup.Root bind:value>
		<div class="flex flex-wrap space-x-2 space-y-2">
			{#each choices as choice, i}
				{#if typeof choice === 'object' && 'name' in choice}
					{@render radio(choice.name, i)}
				{/if}
			{/each}
		</div>
	</RadioGroup.Root>
{/if}
