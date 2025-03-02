<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'WaterSports';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Water Sports Details</h1>
	<GeneralInputs />
	<!-- Equipment Provided -->
	<div class="flex items-center space-x-2">
		<Checkbox id="equipmentProvided" bind:checked />
		<input type="hidden" name={name('equipmentProvided')} value={checked ? 1 : 0} class="size-0" />
		<Label for="equipmentProvided">Equipment Provided</Label>
	</div>

	<!-- Safety Certifications -->
	<div class="space-y-2">
		<Label for="safetyCertifications">Safety Certifications</Label>
		<Input
			id="safetyCertifications"
			name={name('safetyCertifications')}
			type="text"
			placeholder="Enter safety certifications"
		/>
	</div>

	<!-- Group or Solo Activity -->
	<div class="space-y-2">
		<Label for="activityType">Group or Solo Activity</Label>
		<Input id="activityType" name={name('activityType')} type="text" placeholder="Group, Solo" />
	</div>

	<!-- Weather Restrictions -->
	<div class="space-y-2">
		<Label for="weatherRestrictions">Weather Restrictions</Label>
		<Input
			id="weatherRestrictions"
			name={name('weatherRestrictions')}
			type="text"
			placeholder="Enter weather restrictions"
		/>
	</div>
</div>
