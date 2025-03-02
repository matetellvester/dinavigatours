<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'Hiking';
	const [name] = makeNameAttribute(type);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Hiking Details</h1>
	<GeneralInputs />
	<!-- Difficulty Level -->
	<div class="space-y-2">
		<Label for="difficultyLevel">Difficulty Level</Label>
		<Input
			id="difficultyLevel"
			name={name('difficultyLevel')}
			type="text"
			placeholder="Easy, Moderate, Hard"
		/>
	</div>

	<!-- Trail Length and Duration -->
	<div class="space-y-2">
		<Label for="trailLength">Trail Length and Duration</Label>
		<Input
			id="trailLength"
			name={name('trailLength')}
			type="text"
			placeholder="Enter length and duration"
		/>
	</div>

	<!-- Guide Required -->
	<div class="flex items-center space-x-2">
		<Checkbox id="guideRequired" name={name('guideRequired')} />
		<Label for="guideRequired">Guide Required</Label>
	</div>

	<!-- Equipment Recommendations -->
	<div class="space-y-2">
		<Label for="equipmentRecommendations">Equipment Recommendations</Label>
		<Input
			id="equipmentRecommendations"
			type="text"
			name={name('equipmentRecommendations')}
			placeholder="Enter equipment recommendations"
		/>
	</div>
</div>
