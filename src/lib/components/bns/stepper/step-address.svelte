<!-- <script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Button } from '$lib/components/ui/button';
	// import { LOCATIONS } from '$lib/constant/address';

	let selectedMunicipality: string | null = $state(null);
	let value: string = $state('');
	let choices: Bgry[] | string[] = $state([]);

	// Function to set barangays when a municipality is selected
	function selectMunicipality(municipality: string) {
		selectedMunicipality = municipality;
		choices = LOCATIONS[municipality] || [];
		value = ''; // Reset the selected barangay
	}

	// Initialize with municipalities
	choices = Object.keys(LOCATIONS);
</script>

{#snippet radio(name: string, index: number)}
	<RadioGroup.Item value={name} {name} class="sr-only" />

	<Label for={name + index} class="sr-only">{name}</Label>
	<Button
		class="rounded-full capitalize"
		variant={value === name ? 'default' : 'outline'}
		onclick={() => (value = name)}
	>
		{name}
	</Button>
{/snippet}

<RadioGroup.Root bind:value>
	<div class="flex flex-wrap space-x-2 space-y-2">

		{#each choices as choice, i}
			{@render radio(typeof choice === 'string' ? choice : choice.name, i)}
		{/each}
	</div>
</RadioGroup.Root>


{#if selectedMunicipality}
	<Button
		class="mt-4"
		variant="outline"
		onclick={() => {
			selectedMunicipality = null;
			choices = Object.keys(LOCATIONS);
			value = ''; // Reset value
		}}
	>
		Back to Municipalities
	</Button>
{/if} -->
