<script lang="ts">
	import type { PageData } from '../list/$types';
	import DataTable from '$bns-comps/table/business-list/data-table.svelte';
	import { bnsListColumns } from '$lib/components/bns/table/bns-columns';
	import { onMount } from 'svelte';
	import { businessList } from '$bns-comps/table/business-list/state.svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { removeListingModal } from './index.svelte';
	import { toast } from 'svelte-sonner';
	import { Loader } from 'lucide-svelte';
	import { bnsHeader } from '../bns.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let isLoading = $state(false);

	async function handleAction() {
		if (!removeListingModal.value.id) {
			console.error('No ID provided');
			return;
		}

		isLoading = true;
		const res = await fetch('/api/ltsng-basic-info/' + removeListingModal.value.id, {
			method: 'DELETE'
		});

		if (!res.ok) {
			toast.error(`Failed to ${removeListingModal.value.type ?? '--'} listing`);
			return;
		}

		const data = (await res.json()) as { success: true; message: string };

		if (data.success) {
			businessList.remove(removeListingModal.value.id);
			toast.success(`${removeListingModal.value.type?.toProperCase() ?? '--'} Successfully`);
			removeListingModal.value.state = false;
			removeListingModal.value.type = null;
		} else {
			toast.error(
				`Failed to  ${removeListingModal.value.type === 'canceled' ? 'cancel' : 'delete'} listing`
			);
		}

		isLoading = false;
	}

	onMount(() => {
		businessList.value = data.businessList;

		bnsHeader.v = 'Listing';
	});
</script>

<svelte:head>
	<title>Listing</title>
</svelte:head>

<div class="p-4">
	<DataTable data={businessList.value} columns={bnsListColumns} />
</div>

<Dialog.Root bind:open={removeListingModal.value.state}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="capitalize">
				{removeListingModal.value.type ?? '--'} Listing
			</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to {removeListingModal.value.type ?? '--'} this listing? This action cannot
				be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				type="button"
				variant="outline"
				onclick={() => (removeListingModal.value.state = false)}>Cancel</Button
			>

			<Button
				type="button"
				disabled={isLoading}
				onclick={handleAction}
				variant="destructive"
				class="capitalize"
			>
				{#if isLoading}
					<Loader class="animate-spin" />
				{/if}
				<span> {removeListingModal.value.type === 'canceled' ? 'Cancel' : 'Delete'} Listing</span>
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
