<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Catering';
	const [name] = makeNameAttribute(type);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Catering Service Details</h1>
	<GeneralInputs />
	<!-- Cuisine Types Offered -->
	<div class="space-y-2">
		<Label for="cuisineTypes">Cuisine Types Offered</Label>
		<Input
			id="cuisineTypes"
			name={name('cuisineTypes')}
			type="text"
			placeholder="e.g., Italian, Asian, Local"
		/>
	</div>

	<!-- Menu Customization Options -->
	<div class="space-y-2">
		<Label for="menuCustomization">Menu Customization Options</Label>
		<Input
			id="menuCustomization"
			name={name('menuCustomization')}
			type="text"
			placeholder="e.g., Vegan, Gluten-Free, etc."
		/>
	</div>

	<!-- Minimum Order Quantity -->
	<div class="space-y-2">
		<Label for="minOrderQty">Minimum Order Quantity</Label>
		<Input
			id="minOrderQty"
			name={name('minOrderQty')}
			type="number"
			placeholder="Enter minimum order quantity"
		/>
	</div>

	<!-- Dietary Accommodations -->
	<div class="space-y-2">
		<Label for="dietaryAccommodations">Dietary Accommodations</Label>
		<Input
			id="dietaryAccommodations"
			name={name('dietaryAccommodations')}
			type="text"
			placeholder="e.g., Vegan, Gluten-Free, etc."
		/>
	</div>
</div>
