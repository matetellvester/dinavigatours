<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'TherapeuticServices';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
	let checked2 = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Therapeutic Services Details</h1>
	<GeneralInputs />
	<!-- Service Types -->
	<div class="space-y-2">
		<Label for="serviceTypes">Service Types</Label>
		<Input
			id="serviceTypes"
			name={name('serviceTypes')}
			type="text"
			placeholder="Chiropractic, Acupuncture, etc."
		/>
	</div>

	<!-- Licensed Practitioner -->
	<div class="flex items-center space-x-2">
		<Checkbox id="licensedPractitioner" bind:checked />
		<input
			name={name('licensedPractitioner')}
			type="hidden"
			value={checked ? 1 : 0}
			class="size-0"
		/>
		<Label for="licensedPractitioner">Licensed Practitioner</Label>
	</div>

	<!-- Appointment Duration -->
	<div class="space-y-2">
		<Label for="appointmentDuration">Appointment Duration</Label>
		<Input
			id="appointmentDuration"
			name={name('appointmentDuration')}
			type="text"
			placeholder="e.g., 30 min, 1 hour"
		/>
	</div>

	<!-- Health Insurance Accepted -->
	<div class="flex items-center space-x-2">
		<Checkbox id="insuranceAccepted" bind:checked={checked2} />
		<input type="hidden" name={name('insuranceAccepted')} value={checked2 ? 1 : 0} class="size-0" />
		<Label for="insuranceAccepted">Health Insurance Accepted</Label>
	</div>
</div>
