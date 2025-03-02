<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'ShuttleServices';
	const [name] = makeNameAttribute(type);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Shuttle Service Details</h1>
	<GeneralInputs />
	<!-- Routes and Destinations Covered -->
	<div class="space-y-2">
		<Label for="routesDestinations">Routes and Destinations Covered</Label>
		<Input
			id="routesDestinations"
			name={name('routesDestinations')}
			type="text"
			placeholder="Enter routes and destinations"
		/>
	</div>

	<!-- Private or Shared Shuttle -->
	<div class="space-y-2">
		<Label for="shuttleType">Private or Shared Shuttle</Label>
		<Input id="shuttleType" name={name('shuttleType')} type="text" placeholder="Private, Shared" />
	</div>

	<!-- Schedule/Departure Times -->
	<div class="space-y-2">
		<Label for="scheduleTimes">Schedule/Departure Times</Label>
		<Input
			id="scheduleTimes"
			name={name('scheduleTimes')}
			type="text"
			placeholder="Enter schedule or departure times"
		/>
	</div>

	<!-- Group Discount Details -->
	<div class="space-y-2">
		<Label for="groupDiscount">Group Discount Details</Label>
		<Input
			id="groupDiscount"
			name={name('groupDiscount')}
			type="text"
			placeholder="Enter group discount details"
		/>
	</div>
</div>
