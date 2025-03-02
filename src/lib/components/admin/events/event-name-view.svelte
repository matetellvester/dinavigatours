<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	interface Props {
		type: string;
		name: string;
		expired: boolean | null;
	}

	let { type, name, expired }: Props = $props();
</script>

<div>
	<Badge variant="outline" class="rounded-sm capitalize">
		{#if type === 'one_time'}
			One Time
		{:else}
			{type}
		{/if}
		{#if expired}
			<span class="px-1 text-border">|</span>
			<span class="text-destructive"> Ended </span>
		{/if}
	</Badge>
	<span class="max-w-[500px] truncate font-medium">
		{name}
	</span>
</div>
