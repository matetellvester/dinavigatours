<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Photography';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Photography Service Details</h1>
	<GeneralInputs />
	<!-- Service Type -->
	<div class="space-y-2">
		<Label for="serviceType">Service Type</Label>
		<Input
			id="serviceType"
			name={name('serviceType')}
			type="text"
			placeholder="Portrait, Event, Product, etc."
		/>
	</div>

	<!-- Equipment Provided -->
	<div class="space-y-2">
		<Label for="equipmentProvided">Equipment Provided</Label>
		<Input
			id="equipmentProvided"
			name={name('equipmentProvided')}
			type="text"
			placeholder="List of equipment provided"
		/>
	</div>

	<!-- Package Options -->
	<div class="space-y-2">
		<Label for="packageOptions">Package Options</Label>
		<Input
			id="packageOptions"
			name={name('packageOptions')}
			type="text"
			placeholder="Hourly, Full Day"
		/>
	</div>

	<!-- Editing/Retouching Included -->
	<div class="flex items-center space-x-2">
		<Checkbox id="editingIncluded" bind:checked />
		<input type="hidden" name={name('editingIncluded')} value={checked ? 1 : 0} class="size-0" />
		<Label for="editingIncluded">Editing/Retouching Included</Label>
	</div>
</div>
