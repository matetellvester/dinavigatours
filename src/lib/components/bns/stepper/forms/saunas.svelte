<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Saunas';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Sauna Service Details</h1>
	<GeneralInputs />
	<!-- Sauna Type -->
	<div class="space-y-2">
		<Label for="saunaType">Sauna Type</Label>
		<Input id="saunaType" name={name('saunaType')} type="text" placeholder="Dry, Steam, Infrared" />
	</div>

	<!-- Capacity per Session -->
	<div class="space-y-2">
		<Label for="capacity">Capacity per Session</Label>
		<Input
			id="capacity"
			name={name('capacity')}
			type="number"
			placeholder="Enter maximum capacity"
		/>
	</div>

	<!-- Additional Services -->
	<div class="space-y-2">
		<Label for="additionalServices">Additional Services</Label>
		<Input
			id="additionalServices"
			name={name('additionalServices')}
			type="text"
			placeholder="e.g., Spa Treatments"
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
