<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import GeneralInputs from '../general-inputs.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	const type: AllSubCategories = 'VacationRentals';
	const [name] = makeNameAttribute(type);
</script>

<div class="space-y-6 p-4">
	<h1 class="text-2xl font-bold">Vacation Rental Details</h1>

	<GeneralInputs />
	<!-- Property Type -->
	<div class="space-y-2">
		<Label for="propertyType">Property Type</Label>
		<Input
			id="propertyType"
			name={name('propertyType')}
			type="text"
			placeholder="House, Apartment, Condo"
		/>
	</div>

	<!-- Minimum Stay Requirement -->
	<div class="space-y-2">
		<Label for="minimumStay">Minimum Stay Requirement</Label>
		<Input
			id="minimumStay"
			name={name('minimumStay')}
			type="text"
			placeholder="Enter minimum stay"
		/>
	</div>

	<!-- Security Deposit Policy -->
	<div class="space-y-2">
		<Label for="securityDeposit">Security Deposit Policy</Label>
		<Input
			id="securityDeposit"
			name={name('securityDeposit')}
			type="text"
			placeholder="Enter security deposit policy"
		/>
	</div>

	<!-- Cleaning Fee Details -->
	<div class="space-y-2">
		<Label for="cleaningFee">Cleaning Fee Details</Label>
		<Input
			id="cleaningFee"
			name={name('cleaningFee')}
			type="text"
			placeholder="Enter cleaning fee details"
		/>
	</div>
</div>
