<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { Loader, Pen, Plus, Trash2 } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import { toast } from 'svelte-sonner';

	let open = $state(false);

	let modalTitleState = $state('Add');
	let currId = $state(0);
	let isLoading = $state(false);
	let dialogOpen = $state(false);

	interface Props {
		s: SupabaseClient<any, 'public', any>;
		v: {
			name: string;
			value: string;
		};
	}

	let vessels: null | Vessel[] = $state(null);

	let modalVessel: Vessel = $state({
		id: 0,
		name: '',
		departure: '',
		arrival: ''
	});

	let enable = $derived(
		modalVessel.name.trim() !== '' &&
			modalVessel.departure.trim() !== '' &&
			modalVessel.arrival.trim() !== ''
	);

	function resetValue() {
		modalVessel = {
			id: 0,
			name: '',
			departure: '',
			arrival: ''
		};
	}

	function formatTime(time: string): string {
		const [hours, minutes] = time.split(':').map(Number);
		const period = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12;
		return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
	}

	async function addVessel() {
		if (vessels === null) return;
		const { data, error } = await s
			.from('vessels')
			.insert([
				{
					name: modalVessel.name,
					departure: modalVessel.departure,
					arrival: modalVessel.arrival,
					municipal: v.name.toLowerCase().replace(/\s+/g, '')
				}
			])
			.select('*')
			.single();

		if (error) {
			console.error(error);
			toast.error('Failed to add vessel');
			return;
		}

		vessels.push({
			id: data.id,
			name: data.name,
			departure: data.departure,
			arrival: data.arrival
		});
		toast.success('Vessel added successfully');

		console.log(vessels);
	}

	async function editVessel(id: number, updatedVessel: Vessel) {
		if (vessels) {
			const { error } = await s
				.from('vessels')
				.update({
					name: updatedVessel.name,
					departure: updatedVessel.departure,
					arrival: updatedVessel.arrival
				})
				.eq('id', id);

			if (error) {
				console.error(error);
				toast.error('Failed to update vessel');
				return;
			}

			vessels = vessels.map((vessel) =>
				vessel.id === id ? { ...vessel, ...updatedVessel } : vessel
			);

			toast.success('Vessel updated successfully');
		}
	}

	async function deleteVessel() {
		if (!currId) return;

		if (vessels) {
			isLoading = true;

			const { error } = await s.from('vessels').delete().eq('id', currId);

			if (error) {
				console.error(error);
				toast.error('Unable to delete vessel');
				return;
			}
			toast.success('Vessel deleted successfully');

			vessels = vessels.filter((vessel) => vessel.id !== currId);

			currId = 0;
			isLoading = false;
			dialogOpen = false;
		}
	}

	async function modalAddBtn() {
		if (vessels === null) return;

		isLoading = true;
		if (modalTitleState === 'Add') {
			addVessel();
		} else {
			editVessel(currId, modalVessel);
		}
		currId = 0;
		await tick();
		isLoading = false;
		open = false;
		resetValue();
	}

	let { s, v }: Props = $props();

	onMount(async () => {
		const { data, error } = await s
			.from('vessels')
			.select('id, name, departure,arrival')
			.eq('municipal', v.name.toLowerCase().replace(/\s+/g, ''));
		if (error) {
			console.error(error);
		} else {
			vessels = data;
		}
	});
</script>

<div class="block rounded bg-gradient-to-r from-primary/20 px-3 py-1 font-semibold">
	<div class="flex items-center space-x-2">
		<span>
			{v.name}
		</span>
		<Button
			variant="ghost"
			size="sm"
			onclick={() => {
				open = true;
				modalTitleState = 'Add';
			}}><Plus /></Button
		>
	</div>
</div>

<div class="w-full px-4">
	{#if vessels}
		{#each vessels as vessel}
			<div class="group/vessel flex items-center">
				<span class="font-semibold">
					{vessel.name}
				</span>

				<span class="ml-2">
					{formatTime(vessel.departure)} - {formatTime(vessel.arrival)}
				</span>

				<div class="ml-2 inline opacity-0 group-hover/vessel:opacity-100">
					<button
						onclick={() => {
							modalVessel = vessel;
							modalTitleState = 'Edit';
							currId = vessel.id;
							open = true;
						}}><Pen class="size-4" /></button
					>
					<button
						onclick={() => {
							(dialogOpen = true), (currId = vessel.id);
						}}><Trash2 class="size-4 text-destructive" /></button
					>
				</div>
			</div>
		{:else}
			<span class="italic text-muted-foreground">No vessels list</span>
		{/each}
	{:else}
		<Skeleton class="h-6 w-[250px]" />
		<Skeleton class="mt-2 h-6 w-[200px]" />
	{/if}
</div>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{modalTitleState} Vessel</Dialog.Title>
			<Dialog.Description>Click save when you're done.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
				<Input id="name" class="col-span-3" bind:value={modalVessel.name} autocomplete="off" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="departure" class="text-right">Departure</Label>
				<Input
					class="col-span-3 block"
					id="departure"
					type="time"
					bind:value={modalVessel.departure}
					autocomplete="off"
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="arrival" class="text-right">Arrival</Label>
				<Input
					class="col-span-3 block"
					id="arrival"
					type="time"
					bind:value={modalVessel.arrival}
					autocomplete="off"
				/>
			</div>
		</div>
		<Dialog.Footer>
			<Button disabled={!enable || isLoading} onclick={modalAddBtn} type="submit">
				{#if isLoading}
					<Loader class="animate-spin" />
				{/if}
				<span>
					{modalTitleState}
				</span>
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={dialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the vessel and remove its data
				from our records.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isLoading}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class={buttonVariants({ variant: 'destructive' })}
				disabled={isLoading}
				onclick={deleteVessel}
			>
				{#if isLoading}
					<Loader class="animate-spin" />
				{/if}

				<span> Continue </span>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
