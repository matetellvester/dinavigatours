<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'TourPackages';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Tour Packages Details</h1>
	<GeneralInputs />
	<!-- Package Components -->
	<div class="space-y-2">
		<Label for="packageComponents">Package Components (Activities Included)</Label>
		<Input
			name={name('packageComponents')}
			id="packageComponents"
			type="text"
			placeholder="List included activities"
		/>
	</div>

	<!-- Total Duration -->
	<div class="space-y-2">
		<Label for="totalDuration">Total Duration</Label>
		<Input
			name={name('totalDuration')}
			id="totalDuration"
			type="text"
			placeholder="Half Day, Full Day, Multi-Day"
		/>
	</div>

	<!-- Transportation Included -->
	<div class="flex items-center space-x-2">
		<Checkbox id="transportationIncluded" bind:checked />
		<input
			name={name('transportationIncluded')}
			type="hidden"
			value={checked ? 1 : 0}
			class="size-0"
		/>
		<Label for="transportationIncluded">Transportation Included</Label>
	</div>

	<!-- Group Discount Information -->
	<div class="space-y-2">
		<Label for="groupDiscount">Group Discount Information</Label>
		<Input
			id="groupDiscount"
			type="text"
			name={name('groupDiscount')}
			placeholder="Enter group discount details"
		/>
	</div>
</div>
