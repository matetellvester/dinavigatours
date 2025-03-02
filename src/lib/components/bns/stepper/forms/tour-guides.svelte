<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'TourGuides';
	const [name] = makeNameAttribute(type);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Tour Guide Details</h1>
	<GeneralInputs />
	<!-- Languages Spoken -->
	<div class="space-y-2">
		<Label for="languagesSpoken">Languages Spoken</Label>
		<Input
			id="languagesSpoken"
			name={name('languagesSpoken')}
			type="text"
			placeholder="e.g., English, Spanish, French"
		/>
	</div>

	<!-- Certifications/Training -->
	<div class="space-y-2">
		<Label for="certifications">Certifications/Training</Label>
		<Input
			id="certifications"
			name={name('certifications')}
			type="text"
			placeholder="List certifications or training"
		/>
	</div>

	<!-- Specialized Areas -->
	<div class="space-y-2">
		<Label for="specializedAreas">Specialized Areas</Label>
		<Input
			id="specializedAreas"
			name={name('specializedAreas')}
			type="text"
			placeholder="e.g., Historical Sites, Nature"
		/>
	</div>

	<!-- Group Capacity -->
	<div class="space-y-2">
		<Label for="groupCapacity">Group Capacity</Label>
		<Input
			id="groupCapacity"
			name={name('groupCapacity')}
			type="number"
			placeholder="Enter maximum group size"
		/>
	</div>
</div>
