<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { useSidebar } from './context.svelte.js';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet<[]> } = $props();

	const sidebar = useSidebar();
</script>

{#if sidebar.isMobile}
	<Sheet.Root controlledOpen open={sidebar.openMobile}>
		<Sheet.Content
			data-sidebar="sidebar"
			data-mobile="true"
			class="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
			side="left"
		>
			<div class="flex h-full w-full flex-col">
				{@render children?.()}
			</div>
		</Sheet.Content>
	</Sheet.Root>
{:else}
	<div>
		<div
			data-sidebar="sidebar"
			class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
		>
			{@render children?.()}
		</div>
	</div>
{/if}
