<script lang="ts">
	import { Ellipsis, Eye, Pencil, Trash2, FilePenLine, Ban } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { businessList } from '$bns-comps/table/business-list/state.svelte';
	import { toast } from 'svelte-sonner';
	import { removeListingModal } from '../../../../../routes/(business)/b/list/index.svelte';

	interface Props {
		id: number;
		status: boolean | null;
	}

	let { id, status }: Props = $props();

	function onclick(type: 'canceled' | 'deleted') {
		removeListingModal.value = { state: true, type, id };
	}
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
		{#if status !== null}
			{#if status !== false}
				<DropdownMenu.Group>
					<!-- <DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
					<DropdownMenu.Item><Eye /> <span>View</span></DropdownMenu.Item>
					<DropdownMenu.Item><FilePenLine /> <span>Edit</span></DropdownMenu.Item> -->
				</DropdownMenu.Group>
			{/if}

			<DropdownMenu.Item
				class="cursor-pointer text-destructive data-[highlighted]:text-destructive "
				onclick={() => onclick('deleted')}
			>
				<Trash2 /> <span>Delete Listing</span>
			</DropdownMenu.Item>
		{:else}
			<DropdownMenu.Item
				class="cursor-pointer text-destructive data-[highlighted]:text-destructive "
				onclick={() => onclick('canceled')}
			>
				<Ban /> <span>Cancel Listing</span>
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
