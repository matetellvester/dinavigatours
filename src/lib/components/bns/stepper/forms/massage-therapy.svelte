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

	const operationDays = [
		{ value: 'sun', label: 'Sunday' },
		{ value: 'mon', label: 'Monday' },
		{ value: 'tue', label: 'Tuesday' },
		{ value: 'wed', label: 'Wednesday' },
		{ value: 'thu', label: 'Thursday' },
		{ value: 'fri', label: 'Friday' },
		{ value: 'sat', label: 'Saturday' }
	];

	let operationValue = $state([]);

	// const triggerContent = $derived(
	// 	basis.find((f) => f.value === value)?.label ?? 'Select price basis'
	// );

	const operationSelectedValues = $derived(
		operationValue.length > 0
			? operationValue.length == operationDays.length
				? 'Everyday'
				: operationValue.join(', ')
			: 'Select days'
	);

	const basis = [
		{ value: 'hour', label: 'Per Hour' },
		{ value: 'session', label: 'Per Session' }
	];

	let basisValue = $state('');

	const basisSelectedValue = $derived(
		basis.find((f) => f.value === basisValue)?.label ?? 'Select price basis'
	);
</script>

<div class="space-y-6 rounded-xl border bg-muted/10 p-8">
	<h1 class="text-2xl font-bold">Add Massage Therapy Details</h1>

	<div class="grid grid-cols-2 gap-4">
		<div class="w-full">
			<Label for="rate" class="leading-8">Rate</Label>
			<Input id="rate" name="rate" type="number" min="1" placeholder="Rate Per Basis" />
		</div>

		<!-- <div>
			<Label for="basis" class="leading-8">Basis</Label>
			<Input id="basis" name="" type="number" placeholder="e.g., 'per hour' or 'per session'" />
		</div> -->

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

		<div>
			<Label for="typeOfMassage" class="leading-8">Type of massage</Label>
			<Input
				id="typeOfMassage"
				name="typeOfMassage"
				type="text"
				placeholder="e.g., Swedish, Shiatsu, Hot Stone"
			/>
		</div>

		<div class="flex w-full">
			<div class="w-full">
				<Label for="operationDays" class="leading-8">Operation Day/s</Label>
				<input type="hidden" name="operationDays" value={operationValue} />
				<Select.Root type="multiple" bind:value={operationValue}>
					<Select.Trigger id="operationDays" class="w-full rounded-e-none border-e-0 capitalize">
						{operationSelectedValues}
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
				<Input
					id="startTime"
					name="startTime"
					class="block rounded-none border-e-0"
					type="time"
					placeholder="Start time"
				/>
			</div>
			<div class="w-max">
				<Label for="endTime" class="select-none leading-8 opacity-0">To</Label>
				<Input
					id="endTime"
					class="rounded-s-none"
					name="endTime"
					type="time"
					placeholder="Start time"
				/>
			</div>
		</div>
	</div>
</div>
