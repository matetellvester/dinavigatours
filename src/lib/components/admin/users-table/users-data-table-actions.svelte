<script lang="ts">
	import { Trash2, Ellipsis, Eye } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let { id }: { id: string } = $props();
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
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading class="text-xs text-foreground/50">
				Actions
			</DropdownMenu.GroupHeading>
			<DropdownMenu.Item>
				<div class="flex items-center gap-2">
					<Eye />
					<span> View</span>
				</div>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="text-red-500  data-[highlighted]:text-red-600">
			<div class="flex items-center gap-2">
				<Trash2 />
				<span>Delete</span>
			</div>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
