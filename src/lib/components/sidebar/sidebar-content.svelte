<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet<[]> } = $props();
</script>

<div class="flex-1">
	{@render children?.()}
</div>
