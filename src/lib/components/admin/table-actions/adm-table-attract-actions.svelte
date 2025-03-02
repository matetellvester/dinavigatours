<script lang="ts">
	import { Ellipsis, Trash2, Loader, FilePenLine } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { tick } from 'svelte';
	import {
		attractionList,
		attrtSheetState,
		selectedAttraction
	} from '../../../../routes/(admin)/adm/attractions/index.svelte';

	interface Props {
		item: Omit<ExploreItem, 'rating' | 'media' | 'map_link'> & {
			purok: number;
			mapLink: string;
			category: string;
			branch: string;
		};
	}

	let open = $state(false);
	let isLoading = $state(false);

	async function deleteAttraction(e: Event) {
		e.preventDefault();
		try {
			isLoading = true;
			const res = await fetch('/api/ltsng-basic-info/' + item.id, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!res.ok) return toast.error('Unable to delete, please try again...');

			const resData = await res.json();

			if (!resData.success) return toast.error("Action can't complete, please try again...");

			toast.success('Deleted successfully');
			await tick();
			attractionList.remove(item.id);
			open = false;
			await tick();
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
		}
	}

	let { item }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end">
		<DropdownMenu.Item
			class="cursor-pointer text-destructive data-[highlighted]:text-destructive"
			onclick={() => (open = true)}
		>
			<Trash2 /> <span>Delete</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			class="cursor-pointer"
			onclick={async () => {
				selectedAttraction.value = item;
				await tick();
				attrtSheetState.value = true;
			}}><FilePenLine /> <span>Edit Details</span></DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open>
	<Dialog.Content>
		<form>
			<Dialog.Header>
				<Dialog.Title>Delete Attraction</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to delete this attraction? This action cannot be undone.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Button type="button" disabled={isLoading} variant="outline">Cancel</Button>
				<Button type="button" variant="destructive" disabled={isLoading} onclick={deleteAttraction}>
					{#if isLoading}
						<Loader class="size-4 animate-spin" />
					{/if}
					Delete
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
