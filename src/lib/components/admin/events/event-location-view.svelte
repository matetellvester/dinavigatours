<script lang="ts">
	interface Props {
		municical: string;
		bgry: string | null;
	}

	let { municical, bgry }: Props = $props();

	const getLocation = municical + (bgry ? ', ' + bgry : '');
</script>

<div class="capitalize">
	{#if getLocation.trim()}
		{getLocation}
	{:else}
		<span class="text-muted-foreground">No available</span>
	{/if}
</div>
