<script lang="ts">
	import type { Snippet } from 'svelte';
	import SidebarContent from './sidebar-content.svelte';
	let { children }: { children: Snippet<[]> } = $props();
</script>

<div class="flex flex-row">
	<div class="hidden">
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias similique fugit tempore
		voluptatum repellat aperiam fugiat ex qui possimus facilis. Quisquam rerum voluptatibus veniam
		mollitia deleniti quae sint odio iusto.
	</div>
	<SidebarContent>
		{@render children?.()}
	</SidebarContent>
</div>
