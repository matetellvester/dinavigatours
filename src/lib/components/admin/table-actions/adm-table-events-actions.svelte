<script lang="ts">
	import { Ellipsis, Trash2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { eventDialogState } from '$adm-route/adm/events/index.svelte';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	interface Props {
		id: number;
	}

	let { id }: Props = $props();
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
			onclick={() => (eventDialogState.value = { state: true, id })}
			class="cursor-pointer text-destructive data-[highlighted]:text-destructive"
		>
			<Trash2 />
			<span> Delete </span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
