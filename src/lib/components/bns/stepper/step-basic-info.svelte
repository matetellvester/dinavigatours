<script lang="ts">
	import CategorySelector from '$lib/components/category-selector.svelte';
	import { Categorize, Contact, Location } from '$lib/components/svg';
	import Ok from '$lib/components/svg/ok.svelte';
	import ViewDetails from '$lib/components/svg/view-details.svelte';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import StepLocation from './step-location.svelte';
	import { selectedSubCategory } from './stepSteps.svelte';

	import Internet from '$lib/components/svg/internet.svelte';
	import StepContacts from './step-contacts.svelte';

	let businessName = $state('');
	let businessDescrip = $state('');

	let nameAndDespIsDone = $derived(businessName.trim() !== '' && businessDescrip.trim() !== '');
	let locationIsDone = $state(false);
	let categoryIsDone = $state(false);
	let showOtherDetails = $state(false);

	const ports = [
		{ value: 'loreto', label: 'Loreto' },
		{ value: 'tubajon', label: 'Tubajon' },
		{ value: 'libjo', label: 'Libjo' },
		{ value: 'basilisa', label: 'Basilisa' },
		{ value: 'sanJose', label: 'San Jose' },
		{ value: 'cagdianao', label: 'Cagdianao' },
		{ value: 'dinagat', label: 'Dinagat' }
	];
	function checkSubCateg(val: string | null) {
		if (val === null || val.trim() === '') {
			showOtherDetails = false;
			return;
		}
		const sanitizedValue = val.replace(/\s+/g, ''); // Remove all whitespace
		const validCategories = [
			'IslandHopping',
			'DayTrips',
			'BoatTours',
			'Hotels',
			'Resorts',
			'MassageTherapy',
			'Gyms'
		];

		if (validCategories.includes(sanitizedValue)) {
			showOtherDetails = true;
		} else {
			showOtherDetails = false;
		}
	}
</script>

<Accordion.Root type="single" class="w-full">
	<Accordion.Item value="item-2">
		<Accordion.Trigger>
			<div class="inline-flex items-center">
				<Categorize class="mr-1 size-6" />
				Categories
				{#if categoryIsDone}
					<Ok class="ml-1 size-4" />
				{/if}
			</div>
		</Accordion.Trigger>
		<Accordion.Content>
			{@render categoriesSnippet()}
		</Accordion.Content>
	</Accordion.Item>

	<Accordion.Item value="businessName">
		<Accordion.Trigger>
			<div class="inline-flex items-center">
				<Contact class="mr-1 size-6" />
				Name and Description
				{#if nameAndDespIsDone}
					<Ok class="ml-1 size-4" />
				{/if}
			</div>
		</Accordion.Trigger>
		<Accordion.Content>{@render descriptionSnippet()}</Accordion.Content>
	</Accordion.Item>

	<Accordion.Item value="item-3">
		<Accordion.Trigger>
			<div class="inline-flex items-center">
				<Internet class="mr-1 size-6" />
				Social Media and Contacts
			</div>
		</Accordion.Trigger>
		<Accordion.Content>
			<StepContacts />
		</Accordion.Content>
	</Accordion.Item>

	<Accordion.Item value="item-4">
		<Accordion.Trigger>
			<div class="inline-flex items-center">
				<Location class="mr-1 size-6" />
				Location
				{#if locationIsDone}
					<Ok class="ml-1 size-4" />
				{/if}
			</div>
		</Accordion.Trigger>
		<Accordion.Content>
			{@render locationSnippet()}
		</Accordion.Content>
	</Accordion.Item>

	{#if showOtherDetails}
		<Accordion.Item value="item-5">
			<Accordion.Trigger>
				<div class="inline-flex items-center">
					<ViewDetails class="mr-1 size-6" />
					Other Details
				</div>
			</Accordion.Trigger>
			<Accordion.Content>
				{@render otherDetails()}
			</Accordion.Content>
		</Accordion.Item>
	{/if}
</Accordion.Root>

{#snippet descriptionSnippet()}
	<div class="p-1">
		<div>
			<Label for="businessName">Name/ Title</Label>
			<Input
				class="mt-1"
				type="text"
				id="businessName"
				name="businessName"
				placeholder="Give your place a unique and catchy name..."
				bind:value={businessName}
			/>
		</div>
		<div class="mt-2">
			<Label for="businessDescription">Description</Label>
			<Textarea
				class="mt-1"
				id="businessDescription"
				name="businessDescription"
				bind:value={businessDescrip}
				placeholder="Tell people what makes this place special. Share highlights, unique features, or why they’ll love it..."
			/>
		</div>
	</div>
{/snippet}

{#snippet categoriesSnippet()}
	<div>
		<CategorySelector
			onSelect={(v) => {
				categoryIsDone = v !== null;
				selectedSubCategory.value = v;

				checkSubCateg(selectedSubCategory.value);
			}}
		/>
	</div>
{/snippet}

{#snippet locationSnippet()}
	<div>
		<StepLocation onDone={(v) => (locationIsDone = v)} />
	</div>
{/snippet}

{#snippet otherDetails()}
	<Label for="portDesp">How to Get Here</Label>
	<Textarea
		class="mt-1"
		id="portDesp"
		name="portDesp"
		value=""
		placeholder="Provide clear directions, landmarks, or transportation details..."
	/>
{/snippet}
