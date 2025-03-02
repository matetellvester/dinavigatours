<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';

	interface Props {
		name: string;
		isApproved: boolean | null;
	}

	let { name, isApproved }: Props = $props();
</script>

<div class="space-x-2">
	<span class="capitalize">{name}</span>
	{#if isApproved === null}
		<Badge variant="secondary">Pending</Badge>
	{/if}
	{#if isApproved === false}
		<Badge variant="destructive">Rejected</Badge>
	{/if}
</div>
