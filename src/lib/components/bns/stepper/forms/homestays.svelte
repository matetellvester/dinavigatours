<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Homestays';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Homestay Details</h1>
	<GeneralInputs />
	<!-- Host Availability -->
	<div class="space-y-2">
		<Label for="hostAvailability">Host Availability</Label>
		<Input
			id="hostAvailability"
			name={name('hostAvailability')}
			type="text"
			placeholder="On-Site, Remote"
		/>
	</div>

	<!-- Shared Spaces -->
	<div class="flex items-center space-x-2">
		<Checkbox id="sharedSpaces" bind:checked />
		<input name={name('sharedSpaces')} type="hidden" value={checked ? 1 : 0} class="size-0" />
		<Label for="sharedSpaces">Shared Spaces</Label>
	</div>

	<!-- Pet Policy -->
	<div class="space-y-2">
		<Label for="petPolicy">Pet Policy</Label>
		<Input
			id="petPolicy"
			name={name('petPolicy')}
			type="text"
			placeholder="Enter pet policy details"
		/>
	</div>

	<!-- Cultural Experience Options -->
	<div class="space-y-2">
		<Label for="culturalExperience">Cultural Experience Options</Label>
		<Input
			id="culturalExperience"
			name={name('culturalExperience')}
			type="text"
			placeholder="List cultural experiences"
		/>
	</div>
</div>
