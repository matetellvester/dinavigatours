<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Tricycles';
	const [name] = makeNameAttribute(type);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Tricycle Service Details</h1>
	<GeneralInputs />
	<!-- Routes or Service Area -->
	<div class="space-y-2">
		<Label for="serviceArea">Routes or Service Area</Label>
		<Input
			id="serviceArea"
			name={name('serviceArea')}
			type="text"
			placeholder="Enter routes or service area"
		/>
	</div>

	<!-- Capacity (Max Passengers) -->
	<div class="space-y-2">
		<Label for="capacity">Capacity (Max Passengers)</Label>
		<Input
			id="capacity"
			name={name('capacity')}
			type="number"
			placeholder="Enter maximum passengers"
		/>
	</div>

	<!-- Operating Hours -->
	<div class="space-y-2">
		<Label for="operatingHours">Operating Hours</Label>
		<Input
			id="operatingHours"
			name={name('operatingHours')}
			type="text"
			placeholder="Enter operating hours"
		/>
	</div>

	<!-- Fare Information -->
	<div class="space-y-2">
		<Label for="fareInfo">Fare Information</Label>
		<Input id="fareInfo" name={name('fareInfo')} type="text" placeholder="Enter fare details" />
	</div>
</div>
