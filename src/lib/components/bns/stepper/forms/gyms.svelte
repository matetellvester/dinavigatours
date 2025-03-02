<script lang="ts">
	// import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	// import GeneralInputs from '../general-inputs.svelte';
	// import { makeNameAttribute } from '$lib/utils';
	// import { type AllSubCategories } from './types';
	// const type: AllSubCategories = 'MassageTherapy';
	// const [name] = makeNameAttribute(type);
	// let checked = $state(false);

	import * as Select from '$lib/components/ui/select/index.js';
	import AmenitiesAdder from '../amenities-adder.svelte';

	const operationDays = [
		{ value: 'sun', label: 'Sunday' },
		{ value: 'mon', label: 'Monday' },
		{ value: 'tue', label: 'Tuesday' },
		{ value: 'wed', label: 'Wednesday' },
		{ value: 'thu', label: 'Thursday' },
		{ value: 'fri', label: 'Friday' },
		{ value: 'sat', label: 'Saturday' }
	];

	let value = $state([]);

	// const triggerContent = $derived(
	// 	basis.find((f) => f.value === value)?.label ?? 'Select price basis'
	// );

	const selectedValues = $derived(
		value.length > 0
			? value.length == operationDays.length
				? 'Everyday'
				: value.join(', ')
			: 'Select days'
	);

	const basis = [
		{ value: 'hour', label: 'Per Hour' },
		{ value: 'sesion', label: 'Per Session' }
	];

	let basisValue = $state('');

	const basisSelectedValue = $derived(
		basis.find((f) => f.value === basisValue)?.label ?? 'Select price basis'
	);
</script>

<div class="space-y-6 rounded-xl border bg-muted/10 p-8">
	<h1 class="text-2xl font-bold">Add Gym Details</h1>

	<div class="grid grid-cols-2 gap-4">
		<div class="flex space-x-2 [&>*]:flex-1">
			<div>
				<Label for="rate" class="leading-8">Rate</Label>
				<Input id="rate" name="rate" type="number" min="1" placeholder="Rate Per Basis" />
			</div>

			<div class="w-full">
				<Label for="basis" class="leading-8">Basis</Label>
				<Select.Root type="single" name="basis" bind:value={basisValue}>
					<Select.Trigger id="basis" class="w-full">
						{basisSelectedValue}
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
		</div>

		<div class="flex w-full">
			<div class="w-full">
				<Label for="operationDays" class="leading-8">Operation Days and Hours</Label>
				<input type="hidden" name="operationDays" {value} />
				<Select.Root type="multiple" bind:value>
					<Select.Trigger id="operationDays" class="w-full rounded-e-none border-e-0 capitalize">
						{selectedValues}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each operationDays as day}
								<Select.Item value={day.value} label={day.label}>{day.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="text-nowrap">
				<Label for="startTime" class="leading-8">Time</Label>
				<Input id="startTime" name="startTime" class="block rounded-none border-e-0" type="time" />
			</div>
			<div class="w-max">
				<Label for="endTime" class="select-none leading-8 opacity-0">To</Label>
				<Input id="endTime" class="rounded-s-none" name="endTime" type="time" />
			</div>
		</div>
	</div>

	<div class="flex space-x-4 [&>*]:flex-1">
		<AmenitiesAdder
			dataName="typeOfEquip"
			adder={{
				label: 'Types of equipment',
				placeholder: 'e.g., treadmills, dumbbells, rowing machines'
			}}
		/>
		<AmenitiesAdder
			dataName="additionalAmenities"
			adder={{
				label: 'Additional amenities',
				placeholder: 'e.g., locker rooms, personal trainers, parking'
			}}
		/>
	</div>
</div>
