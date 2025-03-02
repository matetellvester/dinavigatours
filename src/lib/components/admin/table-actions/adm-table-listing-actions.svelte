<script lang="ts">
	import { Ellipsis, Trash2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { toast } from 'svelte-sonner';
	import { dialogState, dialogActionsState, deleteDialog } from '$adm-route/adm/list/index.svelte';
	import { Loader } from 'lucide-svelte';
	import { tick } from 'svelte';

	interface Props {
		id: number;
		businessName: string;
		status: boolean | null;
	}

	let { id, businessName, status }: Props = $props();
	type Result = { success: false; message: string } | { success: true; message: null };

	let removing = $state(false);

	async function setAction(action: 'decline' | 'approve') {
		dialogActionsState.value = {
			id,
			action,
			businessName
		};
		await tick();
		dialogState.value = true;
		return;
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
			<DropdownMenu.Item
				class="cursor-pointer text-destructive data-[highlighted]:text-destructive"
				disabled={removing}
				onclick={() => {
					deleteDialog.value.id = id;
					deleteDialog.value.state = true;
				}}
			>
				{#if removing}
					<Loader class="animate-spin" />
				{:else}
					<Trash2 />
				{/if}
				<span>Delete</span>
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
			<DropdownMenu.Item class="cursor-pointer" onclick={() => setAction('approve')}>
				<span>Approve</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item class="cursor-pointer" onclick={() => setAction('decline')}>
				<span>Decline</span>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
