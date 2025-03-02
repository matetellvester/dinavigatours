<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Yoga';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Yoga Class Details</h1>
	<GeneralInputs />
	<!-- Class Types -->
	<div class="space-y-2">
		<Label for="classTypes">Class Types</Label>
		<Input
			id="classTypes"
			name={name('classTypes')}
			type="text"
			placeholder="Beginner, Advanced, etc."
		/>
	</div>

	<!-- Class Schedule and Duration -->
	<div class="space-y-2">
		<Label for="classSchedule">Class Schedule and Duration</Label>
		<Input
			id="classSchedule"
			name={name('classSchedule')}
			type="text"
			placeholder="e.g., Monday 6-7 PM"
		/>
	</div>

	<!-- Max Class Size -->
	<div class="space-y-2">
		<Label for="maxClassSize">Max Class Size</Label>
		<Input
			id="maxClassSize"
			name={name('maxClassSize')}
			type="number"
			placeholder="Enter maximum number of participants"
		/>
	</div>

	<!-- Mat Rental Availability -->
	<div class="flex items-center space-x-2">
		<Checkbox id="matRental" bind:checked />
		<input type="hidden" name={name('matRental')} value={checked ? 1 : 0} class="size-0" />
		<Label for="matRental">Mat Rental Available</Label>
	</div>
</div>
