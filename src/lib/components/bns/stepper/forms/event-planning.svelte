<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'EventPlanning';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Event Planning Service Details</h1>
	<GeneralInputs />
	<!-- Event Types Supported -->
	<div class="space-y-2">
		<Label for="eventTypes">Event Types Supported</Label>
		<Input
			id="eventTypes"
			name={name('eventTypes')}
			type="text"
			placeholder="Weddings, Corporate, etc."
		/>
	</div>

	<!-- Vendor Connections -->
	<div class="space-y-2">
		<Label for="vendorConnections">Vendor Connections</Label>
		<Input
			id="vendorConnections"
			name={name('vendorConnections')}
			type="text"
			placeholder="Florists, Caterers, etc."
		/>
	</div>

	<!-- Service Packages -->
	<div class="space-y-2">
		<Label for="servicePackages">Service Packages</Label>
		<Input
			id="servicePackages"
			name={name('servicePackages')}
			type="text"
			placeholder="Full Service, Day-of Coordination"
		/>
	</div>

	<!-- Budget Management Services -->
	<div class="flex items-center space-x-2">
		<Checkbox id="budgetManagement" bind:checked />
		<input type="hidden" name={name('budgetManagement')} value={checked ? 1 : 0} class="size-0" />
		<Label for="budgetManagement">Budget Management Services</Label>
	</div>
</div>
