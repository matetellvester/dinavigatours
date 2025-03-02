<script lang="ts">
	import type { PageData } from './$types';
	import DataTable from '$lib/components/admin/data-table.svelte';
	import { adminBusinessTableColumns as columns } from '$lib/components/admin/admin-table-columns';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { dialogState, dialogActionsState, admBusinessList, deleteDialog } from './index.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Loader } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { onMount, tick } from 'svelte';
	import { admHeader } from '$adm-route/admin.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let isLoading = $state(false);

	const setApprove = async (id: number, action: 'decline' | 'approve') => {
		try {
			isLoading = true;
			const res = await fetch('/api/ltsng-basic-info/' + id, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ is_approved: action === 'approve' })
				// body: JSON.stringify({ id, action })
			});

			if (!res.ok) {
				throw new Error('Failed to validate ID');
			}

			const data = (await res.json()) as { success: true; message: string };

			if (data.success) {
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}

			if (action === 'approve') {
				admBusinessList.updateApproval(id, true);
			} else {
				admBusinessList.updateApproval(id, false);
			}
		} catch (error) {
			console.error('ERROR setting isApprove', error);
		} finally {
			await tick();
			isLoading = false;
			dialogState.value = false;
		}
	};

	async function delteListing() {
		isLoading = true;

		const res = await fetch('/api/ltsng-basic-info/' + deleteDialog.value.id, {
			method: 'DELETE'
		});

		if (!res.ok) {
			isLoading = false;
			toast.error(`Failed to delete listing`);
			return;
		}

		const data = (await res.json()) as { success: true; message: string };

		if (data.success) {
			admBusinessList.remove(deleteDialog.value.id);

			toast.success(`Deleted Successfully`);
			deleteDialog.value.state = false;
		} else {
			toast.error(`Failed to delete listing`);
		}

		isLoading = false;
	}

	onMount(() => {
		admHeader.v = 'Listing';
		admBusinessList.value = data.businessList;
	});
</script>

<svelte:head>
	<title>Listing | Business List</title>
</svelte:head>

<DataTable data={admBusinessList.value} {columns} />

<Dialog.Root bind:open={dialogState.value}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{dialogActionsState.value.action === 'approve'
					? 'Approve Business'
					: 'Decline Business'}</Dialog.Title
			>
			<Dialog.Description>
				Are you sure you want to <span class="font-bold">{dialogActionsState.value.action}</span>
				the business "{dialogActionsState.value.businessName}"?
			</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer>
			<Button variant="secondary" disabled={isLoading} onclick={() => (dialogState.value = false)}>
				Cancel
			</Button>
			<Button
				class="capitalize"
				disabled={isLoading}
				onclick={() => setApprove(dialogActionsState.value.id, dialogActionsState.value.action)}
			>
				{#if isLoading}
					<Loader class="animate-spin" />
				{/if}
				<span>{dialogActionsState.value.action}</span>
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={deleteDialog.value.state}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="capitalize">Delete Listing</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delte this listing? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				type="button"
				disabled={isLoading}
				variant="outline"
				onclick={() => (deleteDialog.value.state = false)}
			>
				Cancel
			</Button>

			<Button
				class="capitalize"
				type="button"
				disabled={isLoading}
				variant="destructive"
				onclick={delteListing}
			>
				{#if isLoading}
					<Loader class="animate-spin" />
				{/if}
				<span> Delete Listing</span>
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
