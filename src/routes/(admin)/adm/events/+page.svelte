<script lang="ts">
	import { admEventsCols } from '$adm-comps/admin-table-columns';
	import DataTable from '$adm-comps/data-table.svelte';
	import { admHeader } from '$adm-route/admin.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { eventDialogState, eventsList } from './index.svelte';

	import { Loader } from 'lucide-svelte';

	async function fetchEvents() {
		try {
			const response = await fetch('/api/events');
			if (!response.ok) {
				throw new Error('Failed to fetch events');
			}
			const events = await response.json();
			return events;
		} catch (error) {
			console.error('Error fetching events:', error);
			return [];
		}
	}

	async function handleDelete() {
		if (!eventDialogState.value.id) {
			toast.error('Event ID is missing');
			return;
		}

		isDeleting = true;
		try {
			const response = await fetch(`/api/events/${eventDialogState.value.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete event');
			}

			const result = await response.json();

			if (result.success) {
				toast.success('Event deleted successfully');
				eventsList.remove(eventDialogState.value.id);
				eventDialogState.value.state = false;
			} else {
				toast.error('Failed to delete event');
			}
		} catch (error) {
			console.error('Error deleting event:', error);
			toast.error('Error deleting event');
		} finally {
			isDeleting = false;
		}
	}

	let isDeleting = $state(false);

	onMount(async () => {
		admHeader.v = 'Events List';

		const events = await fetchEvents();

		if (events.success) {
			eventsList.value = events.data;
		}
	});
</script>

<svelte:head>
	<title>Events | Admin</title>
</svelte:head>

<DataTable data={eventsList.value} columns={admEventsCols} add={{ href: '/adm/events/add' }} />

<Dialog.Root bind:open={eventDialogState.value.state}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Event</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete this event? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				type="button"
				disabled={isDeleting}
				variant="secondary"
				onclick={() => (eventDialogState.value.state = false)}>Cancel</Button
			>
			<Button type="button" variant="destructive" disabled={isDeleting} onclick={handleDelete}>
				{#if isDeleting}
					<Loader class="animate-spin" />
				{/if}
				Delete
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- <DaySelect month="December" /> -->
