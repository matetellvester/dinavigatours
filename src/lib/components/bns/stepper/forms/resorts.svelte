<script lang="ts">
	// import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	// import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	// import GeneralInputs from '../general-inputs.svelte';
	// import { makeNameAttribute } from '$lib/utils';
	// import { type AllSubCategories } from './types';
	import ButtonToggle from '../button-toggle.svelte';
	import AmenitiesAdder from '../amenities-adder.svelte';
	// const type: AllSubCategories = 'Resorts';
	// const [name] = makeNameAttribute(type);
	// let checked = $state(false);

	let fromValue = $state('');
</script>

<input type="hidden" name="rate" value={fromValue} class="select-none opacity-0" />

<div class="space-y-6 rounded-xl border bg-muted/10 p-8">
	<h1 class="text-2xl font-bold">Add Resorts Details</h1>
	<div class="grid grid-cols-2 gap-4">
		<div class="flex flex-col">
			<!-- Rate/Price Range -->
			<div class="flex space-x-2 pb-8">
				<div class="w-full space-y-2">
					<div class="flex w-full space-x-2">
						<div class="w-full">
							<Label for="from" class="leading-8">Rate/Price Range</Label>
							<Input
								id="from"
								name="from"
								type="number"
								min="1"
								bind:value={fromValue}
								placeholder="Min Price"
							/>
						</div>

						<div class="w-full">
							<Label for="to" class="leading-8 opacity-0">To</Label>
							<Input id="to" name="to" type="number" min={fromValue} placeholder="Max Price" />
						</div>
					</div>
				</div>
			</div>

			<!-- Room Types Available -->
			<div class="space-y-2">
				<Label for="maximumCapacity">Maximum Capacity</Label>
				<Input id="maximumCapacity" type="number" placeholder="Enter the max number of guests" />
			</div>
		</div>

		<div class="flex flex-col">
			<!-- Room Types Available -->
			<div class="pb-8">
				<span class="text-sm font-medium leading-none">Room Types Available</span>
				<div class="mt-2 flex">
					<ButtonToggle title="Deluxe" name="roomTypes[deluxe]" />
					<ButtonToggle title="Standard" name="roomTypes[standard]" class="ml-2" />
					<ButtonToggle title="Suite" name="roomTypes[suite]" class="ml-2" />
				</div>
			</div>
			<div class="pb-8">
				<span class="text-sm font-medium leading-none">Bed Types Available</span>
				<div class="mt-2 flex">
					<ButtonToggle title="Single" name="bedTypes[single]" />
					<ButtonToggle title="King Bed" name="bedTypes[kingBed]" class="ml-2" />
					<ButtonToggle title="Queen Bed" name="bedTypes[queenBed]" class="ml-2" />
				</div>
			</div>
		</div>

		<!-- Amenities -->
		<div class="space-y-2">
			<AmenitiesAdder
				dataName="amenities"
				adder={{
					label: 'Amenities/Facilities',
					placeholder: 'Enter amenities, then click the "+" to add'
				}}
			/>
		</div>
	</div>
</div>
