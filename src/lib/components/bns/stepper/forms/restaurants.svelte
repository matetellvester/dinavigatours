<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Restaurants';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Restaurant Details</h1>
	<GeneralInputs />
	<!-- Cuisine Type -->
	<div class="space-y-2">
		<Label for="cuisineType">Cuisine Type</Label>
		<Input
			id="cuisineType"
			name={name('cuisineType')}
			type="text"
			placeholder="Asian, Italian, Local, etc."
		/>
	</div>

	<!-- Menu Upload Option -->
	<div class="space-y-2">
		<Label for="menuUpload">Menu Upload Option</Label>
		<Input id="menuUpload" name={name('menuUpload')} type="file" />
	</div>

	<!-- Average Price per Meal -->
	<div class="space-y-2">
		<Label for="avgPricePerMeal">Average Price per Meal</Label>
		<Input
			id="avgPricePerMeal"
			name={name('avgPricePerMeal')}
			type="text"
			placeholder="Enter average price"
		/>
	</div>

	<!-- Reservation Required -->
	<div class="flex items-center space-x-2">
		<Checkbox id="reservationRequired" bind:checked />
		<input
			type="hidden"
			name={name('reservationRequired')}
			value={checked ? 1 : 0}
			class="size-0"
		/>
		<Label for="reservationRequired">Reservation Required</Label>
	</div>
</div>
