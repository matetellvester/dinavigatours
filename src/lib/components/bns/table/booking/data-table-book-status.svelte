<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { cn, statusClass } from '$lib/utils';
	import { format, parseISO } from 'date-fns';

	interface Props {
		status: BookingStatus;
		created_at: string;
	}

	let { status, created_at }: Props = $props();
</script>

<div class="space-x-2">
	<span class="capitalize">{format(parseISO(created_at), 'MMM dd, yyyy')}</span>
	<!-- <Badge variant="secondary">Pending</Badge> -->
	<!-- {#if status === 'pending'}
	{/if}
	{#if status === 'canceled'}
		<Badge variant="destructive">Canceled</Badge>
	{/if} -->

	<Badge class={cn(statusClass[status], 'capitalize')}>{status}</Badge>
</div>
