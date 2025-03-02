<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { ChevronLeft, Loader } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import ValidId from '$lib/components/valid-id.svelte';
	import * as Select from '$lib/components/ui/select/index.js';

	interface Props {
		data: PageData;
	}

	let info = $state({
		first_name: '',
		last_name: '',
		contact_info: '',
		dateOfBirth: '',
		nationality: '',
		gender: '',
		address: ''
	});

	let validId = $state({
		num: '',
		type: ''
	});
	let saving = $state(false);

	let { data }: Props = $props();

	const sex = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' }
	];

	const triggerContent = $derived(
		sex.find((f) => f.value === info.gender)?.label ?? 'Select Gender'
	);

	onMount(() => {
		if (!data.info) return;
		info = data.info;
		validId = data.info.validId;
	});

	async function submitForm(e: Event) {
		e.preventDefault();
		try {
			saving = true;
			const response = await fetch('/api/userlist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					first_name: info.first_name,
					last_name: info.last_name,
					contact_info: info.contact_info.trim() || null,
					validId,
					dateOfBirth: info.dateOfBirth,
					nationality: info.nationality,
					address: info.address,
					gender: info.gender
				})
			});

			if (response.ok) {
				toast.success('Edit saved');
			} else {
				toast.error('Edit not saved, please try again...');
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			saving = false;
		}
	}
</script>

<div class="flex flex-col">
	<div class="flex flex-1 items-center border-b p-2">
		<Button class="size-10  [&>svg]:size-10" onclick={() => window.history.back()} variant="ghost">
			<ChevronLeft />
		</Button>
		<span class="ml-2 font-semibold">Your Information</span>
	</div>

	<div class="mt-4 flex h-full px-8">
		<div class="m-auto w-full max-w-3xl rounded-lg p-6 shadow-lg ring-1">
			<h2 class="text-2xl font-semibold">My details</h2>
			<p class="mb-6 text-sm text-muted-foreground">
				This information will be used during the booking process
			</p>

			<form class="space-y-4" autocomplete="off" onsubmit={submitForm}>
				<div class="flex w-full gap-2">
					<div class="w-full">
						<label
							for="first_name"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>First Name</label
						>
						<Input
							id="first_name"
							bind:value={info.first_name}
							required
							placeholder="Enter first name"
							class="mt-1 block w-full"
						/>
					</div>

					<div class="w-full">
						<label
							for="last_name"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>Last Name</label
						>
						<Input
							id="last_name"
							bind:value={info.last_name}
							required
							placeholder="Enter last name"
							class="mt-1 block w-full"
						/>
					</div>
				</div>

				<div class="flex w-full gap-2">
					<div class="w-full">
						<label
							for="contact_info"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>Contact Info</label
						>
						<Input
							bind:value={info.contact_info}
							required
							id="contact_info"
							placeholder="Enter contact information"
							class="mt-1 block w-full"
						/>
					</div>

					<div class="w-full">
						<label
							for="dateOfBirth"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>Date of Birth</label
						>
						<Input
							bind:value={info.dateOfBirth}
							required
							id="dateOfBirth"
							type="date"
							placeholder="Enter contact information"
							class="mt-1 block w-full"
						/>
					</div>
				</div>

				<div class="flex w-full gap-2">
					<div class="min-w-20">
						<label
							for="nationality"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>Nationality</label
						>
						<Input
							bind:value={info.nationality}
							required
							id="nationality"
							placeholder="Enter contact information"
							class="mt-1 block w-full"
						/>
					</div>

					<div>
						<span
							class="text-sm font-medium leading-7 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>Gender</span
						><Select.Root type="single" name="favoriteFruit" bind:value={info.gender}>
							<Select.Trigger class="w-[180px]">
								{triggerContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each sex as s}
										<Select.Item value={s.value} label={s.label} />
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
					<div>
						<ValidId bind:type={validId.type} bind:inputValue={validId.num} />
					</div>
				</div>

				<div>
					<span
						class="text-sm font-medium leading-7 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>Address</span
					>
					<Input type="text" bind:value={info.address} required placeholder="Enter address" />
				</div>

				<div class="mt-4 flex">
					<Button
						disabled={saving}
						class="w-full rounded-md  text-white md:ml-auto md:w-auto"
						type="submit"
					>
						{#if saving}
							<Loader class="animate-spin" />
						{/if}
						Save Edits
					</Button>
				</div>
			</form>
		</div>
	</div>
</div>
