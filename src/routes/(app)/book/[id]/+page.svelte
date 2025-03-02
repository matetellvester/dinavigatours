<script lang="ts">
	import Cash from '$lib/components/svg/cash.svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import type { PageData } from './$types';

	let value = $state('cash');

	let { data }: { data: PageData } = $props();
</script>

<form method="POST" autocomplete="off">
	<section class="p-6 md:p-7 lg:p-8">
		<h2 class="text-lg font-semibold">Booking Information</h2>
		<div class="my-4 grid gap-4">
			<!-- Name -->
			<div>
				<Label for="fullName">Full Name</Label>
				<Input id="fullName" type="text" name="fullName" placeholder="Enter full name" />
			</div>

			<!-- Email -->
			<div>
				<Label for="email">Email</Label>
				<Input id="email" type="email" name="email" placeholder="Enter contact email" />
			</div>

			<!-- Phone Number -->
			<div>
				<Label for="phoneNumber">Phone Number</Label>
				<Input id="phoneNumber" type="tel" name="phoneNumber" placeholder="Enter phone number" />
			</div>

			<!-- Booking Date -->
			<div>
				<Label for="bookingDate">Booking Date</Label>
				<Input id="bookingDate" type="date" name="bookingDate" />
			</div>

			<!-- Booking Time -->
			<div>
				<Label for="bookingTime">Booking Time</Label>
				<Input id="bookingTime" type="time" name="bookingTime" />
			</div>

			<!-- Number of People -->
			<div>
				<Label for="numPeople">Number of People</Label>
				<Input id="numPeople" type="number" name="numPeople" placeholder="Enter number of people" />
			</div>

			<!-- Payment Method -->
			<div>
				<span
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>Payment Method</span
				>
				<input aria-hidden="true" type="hidden" bind:value />
				<RadioGroup.Root bind:value class="mt-2">
					<div class="flex w-full">
						<div
							class="pointer-events-none flex flex-1 select-none items-center space-x-2 opacity-50"
						>
							<RadioGroup.Item value="gcash" class="sr-only" id="r1" />
							<Label
								for="r1"
								class=" flex w-full  flex-col items-center rounded-md border p-4
							{value === 'gcash' ? 'ring-2' : ''}"
							>
								<span class="text-nowrap">Gcash <i>&lpar;Unavailable&rpar;</i></span>
								<div class="mt-1 flex justify-center">
									<img src="/gcash.png" alt="GCash Logo" class="h-8" />
								</div>
							</Label>
						</div>
						<div class="flex flex-1 items-center space-x-2">
							<RadioGroup.Item value="cash" id="r2" class="sr-only" />
							<Label
								for="r2"
								class="flex w-full flex-col items-center rounded-md border p-4
						 {value === 'cash' ? 'ring-2' : ''}"
								>Cash
								<Cash class="size-9" /></Label
							>
						</div>
					</div>
				</RadioGroup.Root>
			</div>

			<!-- Special Requests -->
			<div>
				<Label for="specialRequests">Special Requests</Label>
				<Textarea
					id="specialRequests"
					name="specialRequests"
					placeholder="Enter any special requests"
				/>
			</div>
		</div>
		<Button class="float-end mb-4" type="submit">Submit Booking</Button>
	</section>
</form>
