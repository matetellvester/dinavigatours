<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Guesthouses';
	const [name] = makeNameAttribute(type);
	let checked = $state(false);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Guesthouse Details</h1>
	<GeneralInputs />
	<!-- Shared or Private Rooms -->
	<div class="space-y-2">
		<Label for="roomType">Shared or Private Rooms</Label>
		<Input id="roomType" name="roomType" type="text" placeholder="Shared, Private" />
	</div>

	<!-- Kitchen Access -->
	<div class="flex items-center space-x-2">
		<Checkbox id="kitchenAccess" bind:checked />
		<input type="hidden" name="kitchenAccess" value={checked ? 1 : 0} class="size-0" />
		<Label for="kitchenAccess">Kitchen Access</Label>
	</div>

	<!-- Community Activities or Tours -->
	<div class="space-y-2">
		<Label for="communityActivities">Community Activities or Tours</Label>
		<Input
			id="communityActivities"
			name="communityActivities"
			type="text"
			placeholder="List activities or tours"
		/>
	</div>

	<!-- Long-Term Stay Options -->
	<div class="space-y-2">
		<Label for="longTermStay">Long-Term Stay Options</Label>
		<Input
			id="longTermStay"
			name="longTermStay"
			type="text"
			placeholder="Enter long-term stay options"
		/>
	</div>
</div>
