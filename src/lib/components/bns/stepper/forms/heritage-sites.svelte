<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'HeritageSites';
	const [name] = makeNameAttribute(type);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Heritage Sites Details</h1>
	<GeneralInputs />
	<!-- Historical Significance Overview -->
	<div class="space-y-2">
		<Label for="historicalSignificance">Historical Significance Overview</Label>
		<Input
			id="historicalSignificance"
			name={name('historicalSignificance')}
			type="text"
			placeholder="Provide an overview"
		/>
	</div>

	<!-- Guided Tour Availability -->
	<div class="flex items-center space-x-2">
		<Checkbox id="guidedTour" name={name('guidedTour')} />
		<Label for="guidedTour">Guided Tour Availability</Label>
	</div>

	<!-- Entry Fee -->
	<div class="space-y-2">
		<Label for="entryFee">Entry Fee (if applicable)</Label>
		<Input id="entryFee" name={name('entryFee')} type="text" placeholder="Enter entry fee" />
	</div>

	<!-- Visitor Rules and Restrictions -->
	<div class="space-y-2">
		<Label for="visitorRules">Visitor Rules and Restrictions</Label>
		<Input
			id="visitorRules"
			name={name('visitorRules')}
			type="text"
			placeholder="Enter rules and restrictions"
		/>
	</div>
</div>
