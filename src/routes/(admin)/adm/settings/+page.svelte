<script lang="ts">
	import { admHeader } from '$adm-route/admin.svelte';
	import { onMount } from 'svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Info, Loader, Pencil, Plus, Trash2 } from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { fade, fly, slide } from 'svelte/transition';
	import { toast } from 'svelte-sonner';

	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { data }: { data: PageData } = $props();

	type EmergencyContact = {
		label: string;
		value: string;
	};

	let adding = $state(false);

	let open = $state(false);

	let newContac: EmergencyContact = $state({ label: '', value: '' });
	let isEditing = $state(false);

	let emergencyContacts: EmergencyContact[] = $state([]);

	function enableInputEditing(inputId: string) {
		const inputElement = document.getElementById(inputId) as HTMLInputElement;
		// const inputLabelElement = document.getElementById(`label${inputId}`) as HTMLInputElement;
		// const divElement = document.getElementById(`div${inputId}`) as HTMLDivElement;

		if (inputElement) {
			inputElement.style.pointerEvents = 'auto';
			// inputLabelElement.style.display = 'flex';
			// divElement.style.placeSelf = 'normal';
			inputElement.focus();
			isEditing = true;

			const onFocusOut = () => {
				inputElement.style.pointerEvents = 'none';
				// divElement.style.placeSelf = 'auto';
				// inputLabelElement.style.display = 'none';
				inputElement.removeEventListener('focusout', onFocusOut);
				isEditing = false;
				update();
			};

			inputElement.addEventListener('focusout', onFocusOut);
		}
	}

	function removeEmergencyContact(index: number) {
		if (index >= 0 && index < emergencyContacts.length) {
			let sure = true;
			const removed = emergencyContacts[index];
			emergencyContacts = emergencyContacts.filter((_, i) => i !== index);
			toast('Contact Deleted', {
				action: {
					label: 'Undo',
					onClick: () => {
						sure = false;
						emergencyContacts = [removed, ...emergencyContacts];
					}
				},
				onAutoClose: async () => {
					await update();
					toast.success('Contact Completely Deleted');
				}
			});
		}
	}

	async function update() {
		const res = await fetch('/adm/settings', {
			method: 'POST',
			body: JSON.stringify({ contactInfos: emergencyContacts })
		});

		if (!res.ok) {
			console.error('Failed to update contacts');
		}
	}

	const handleSubmit: SubmitFunction = ({ formData }) => {
		if (!newContac.label.trim() || !newContac.value.trim()) {
			return;
		}

		adding = true;
		const dataToSend = [...emergencyContacts, newContac];
		formData.append('obj', JSON.stringify(dataToSend));

		return async ({ result, update }) => {
			if (result.type === 'success' && result.data && result.data.success) {
				toast.success('Contact Added Successfully');
				emergencyContacts = [newContac, ...emergencyContacts];
				newContac = { label: '', value: '' };
				open = false;
			} else {
				toast.error('Failed to add contact');
			}
			update({ reset: true });
			adding = false;
		};
	};

	onMount(async () => {
		admHeader.v = 'Settings';

		emergencyContacts = data.contacts.contactInfos || [];
	});
</script>

<svelte:head>
	<title>Settings | Admin</title>
</svelte:head>

<Tabs.Root value="contact" class="flex-1">
	<!-- <Tabs.List class="w-full justify-start bg-transparent">
		<Tabs.Trigger value="account">Contact Informations</Tabs.Trigger>
	</Tabs.List> -->
	<Tabs.Content value="contact" class="h-full">
		<div class="flex h-full flex-col">
			<h1 class="font-poppins font-semibold">Emergency Contacts</h1>

			{#if !emergencyContacts.length}
				<div
					class="mb-8 mt-2 flex gap-4 rounded-xl border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500"
				>
					<Info class="size-10" />
					<p class="">
						<strong>Oops! It looks like you haven’t added an emergency contact yet.</strong> Adding one
						helps ensure tourists are covered in case of an emergency.
					</p>
				</div>
			{/if}

			<p class="my-2 text-sm">
				You can add up to <strong>5</strong> emergency contacts.
			</p>
			<div class="border-t-2 pt-2">
				<Button
					disabled={emergencyContacts.length >= 5}
					size="sm"
					class="float-end w-max"
					onclick={() => {
						open = true;
					}}
				>
					<span>Add</span>
					<Plus class="size-4" />
				</Button>
			</div>
			<div class="space-y-2 pt-4">
				{#each emergencyContacts as contact, i}
					<div
						class:isEditing
						class=" group grid grid-cols-4 items-center gap-2"
						in:fade
						out:fly={{ duration: 300 }}
					>
						<div class="relative py-2 text-right" id="divcontact{i + 1}">
							<div
								class=" absolute inset-0 flex w-max gap-2 bg-gradient-to-r from-background from-70% to-transparent to-90% pr-6 opacity-0 transition-opacity group-hover:opacity-100
                {isEditing ? 'hideButtons' : ''}"
							>
								<button title="Edit contact" onclick={() => enableInputEditing(`contact${i + 1}`)}>
									<Pencil class="size-4" />
								</button>

								<button title="Remove contact" onclick={() => removeEmergencyContact(i)}>
									<Trash2 class="size-4 text-destructive" />
								</button>
							</div>
							<Label for="contact{i + 1}">{contact.label}</Label>
						</div>

						<div class="col-span-3 space-y-2">
							<!-- <label for="labelcontact{i + 1}" class="sr-only">Name</label>
							<Input
								style="display: none;"
								id="labelcontact{i + 1}"
								type="text"
								bind:value={contact.label}
							/> -->
							<Input
								style="pointer-events: none;"
								type="text"
								id="contact{i + 1}"
								bind:value={contact.value}
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Tabs.Content>
</Tabs.Root>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<form action="" autocomplete="off" use:enhance={handleSubmit} method="POST">
			<Dialog.Header>
				<Dialog.Title>Add new contact</Dialog.Title>
				<Dialog.Description>Click save when you're done.</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input id="name" class="col-span-3" bind:value={newContac.label} />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="num" class="text-right">Contact</Label>
					<Input id="num" class="col-span-3" bind:value={newContac.value} />
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close
					disabled={adding}
					class={buttonVariants({ variant: 'outline' })}
					onclick={() => (newContac = { label: '', value: '' })}>Cancel</Dialog.Close
				>
				<Button
					type="submit"
					disabled={!newContac.label.trim() || !newContac.value.trim() || adding}
				>
					{#if adding}
						<Loader class="animate-spin" />
					{/if}
					<span> Add Contact </span>
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<style>
	.hideButtons {
		opacity: 0 !important;
		pointer-events: none;
	}

	.isEditing {
		opacity: 50%;
	}

	.isEditing:focus-within {
		opacity: 100% !important;
	}
</style>
