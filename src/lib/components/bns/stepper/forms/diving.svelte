<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Diving';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Diving Details</h1>
	<GeneralInputs />
	<!-- Dive Certification Requirements -->
	<div class="space-y-2">
		<Label for="diveCertification">Dive Certification Requirements</Label>
		<Input
			id="diveCertification"
			name={name('diveCertification')}
			type="text"
			placeholder="Enter certification requirements"
		/>
	</div>

	<!-- Dive Sites Included -->
	<div class="space-y-2">
		<Label for="diveSites">Dive Sites Included</Label>
		<Input id="diveSites" name={name('diveSites')} type="text" placeholder="List dive sites" />
	</div>

	<!-- Equipment Rental -->
	<div class="flex items-center space-x-2">
		<Checkbox id="equipmentRental" bind:checked />
		<input name={name('equipmentRental')} type="hidden" value={checked ? 1 : 0} class="size-0" />
		<Label for="equipmentRental">Equipment Rental</Label>
	</div>

	<!-- Safety Protocols and Certifications -->
	<div class="space-y-2">
		<Label for="safetyProtocols">Safety Protocols and Certifications</Label>
		<Input
			id="safetyProtocols"
			name={name('safetyProtocols')}
			type="text"
			placeholder="Enter safety protocols"
		/>
	</div>
</div>
