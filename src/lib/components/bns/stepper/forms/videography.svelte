<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Videography';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
	let checked2 = $state(false);
	let checked3 = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Videography Service Details</h1>
	<GeneralInputs />
	<!-- Types of Videos -->
	<div class="space-y-2">
		<Label for="videoTypes">Types of Videos</Label>
		<Input
			id="videoTypes"
			name={name('videoTypes')}
			type="text"
			placeholder="Event, Promotional, Documentary"
		/>
	</div>

	<!-- Drone Service Availability -->
	<div class="flex items-center space-x-2">
		<Checkbox id="droneService" bind:checked />
		<input type="hidden" name={name('droneService')} value={checked ? 1 : 0} class="size-0" />
		<Label for="droneService">Drone Service Availability</Label>
	</div>

	<!-- Video Editing Included -->
	<div class="flex items-center space-x-2">
		<Checkbox id="videoEditing" bind:checked={checked2} />
		<input type="hidden" name={name('videoEditing')} value={checked2 ? 1 : 0} class="size-0" />
		<Label for="videoEditing">Video Editing Included</Label>
	</div>

	<!-- Licensing for Commercial Use -->
	<div class="flex items-center space-x-2">
		<Checkbox id="commercialLicensing" bind:checked={checked3} />
		<input
			type="hidden"
			name={name('commercialLicensing')}
			value={checked3 ? 1 : 0}
			class="size-0"
		/>
		<Label for="commercialLicensing">Licensing for Commercial Use</Label>
	</div>
</div>
