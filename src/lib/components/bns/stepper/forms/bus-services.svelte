<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	// import { makeNameAttribute } from '$lib/utils';
	// import { type AllSubCategories } from './types';
	// import GeneralInputs from '../general-inputs.svelte';
	// const type: AllSubCategories = 'BusServices';
	// const [name] = makeNameAttribute(type);

	import * as Select from '$lib/components/ui/select/index.js';

	const basis = [
		{ value: 'hourly', label: 'Hourly' },
		{ value: 'daily', label: 'Daily' },
		{ value: 'person', label: 'Person' }
	];

	let value = $state('');

	const triggerContent = $derived(
		basis.find((f) => f.value === value)?.label ?? 'Select price basis'
	);
</script>

<div class="space-y-6 rounded-xl border bg-muted/10 p-8">
	<h1 class="text-2xl font-bold">Add Bus Services Details</h1>

	<div class="grid grid-cols-2 gap-4">
		<div class="w-full">
			<Label for="rate" class="leading-8">Rate/Price</Label>
			<Input id="rate" name="rate" type="number" min="1" placeholder="Price/Rate Per Basis" />
		</div>
		<div class="w-full">
			<Label for="basis" class="leading-8">Basis for price/rate</Label>
			<Select.Root type="single" name="basis" bind:value>
				<Select.Trigger id="basis" class="w-full">
					{triggerContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each basis as base}
							<Select.Item value={base.value} label={base.label}>{base.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>

		<div>
			<Label for="maximumCapacity" class="leading-8">Maximum Capacity</Label>
			<Input
				id="maximumCapacity"
				type="number"
				name="maximumCapacity"
				placeholder="Enter the max number of guests"
			/>
		</div>
		<div>
			<Label for="overdueCharge" class="leading-8">Overdue Charges</Label>
			<Input
				id="overdueCharge"
				type="number"
				name="overdueCharge"
				placeholder="Enter overdue charges"
			/>
		</div>
	</div>
</div>
