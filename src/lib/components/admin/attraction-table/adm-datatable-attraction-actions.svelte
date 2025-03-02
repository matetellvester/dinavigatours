<script lang="ts">
	import { Ellipsis, Eye, Pencil, Trash2, FilePenLine } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { businessList } from '$bns-comps/table/business-list/state.svelte';
	import { toast } from 'svelte-sonner';
	import { dialogState, dialogActionsState } from '$adm-route/adm/list/index.svelte';

	interface Props {
		id: number;
		businessName: string;
		status: boolean | null;
	}

	let { id, businessName, status }: Props = $props();
	type Result = { success: false; message: string } | { success: true; message: null };
	const validateId = async () => {
		try {
			const response = await fetch('/b/list', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id })
			});

			if (!response.ok) {
				throw new Error('Failed to validate ID');
			}

			const data = (await response.json()) as { success: true; message: null };

			return data;
		} catch (err) {}
	};

	async function setAction(action: 'decline' | 'approve') {
		dialogActionsState.value = {
			id,
			action,
			businessName
		};
		dialogState.value = true;
		return;
		const res = await validateId();
		if (res) {
			businessList.remove(id);
			toast.success('Remove Successfully');
		} else {
			console.error(res);
		}
	}
</script>

{#if status !== null}
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
			{#if status !== false}
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
					<!-- <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
        				Copy payment ID
        			</DropdownMenu.Item> -->
					<DropdownMenu.Item><Eye /> <span>View</span></DropdownMenu.Item>
					<DropdownMenu.Item><FilePenLine /> <span>Edit</span></DropdownMenu.Item>
					<DropdownMenu.Item><Pencil /> <span>Manage</span></DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
			{/if}

			<DropdownMenu.Item class="text-destructive data-[highlighted]:text-destructive">
				<Trash2 /> <span>Delete</span>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else}
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
			<DropdownMenu.Item onclick={() => setAction('approve')}>
				<span>Approve</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => setAction('decline')}>
				<span>Decline</span>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
