<script lang="ts">
	import { ChevronLeft } from 'lucide-svelte';
	import type { LayoutData } from './$types';
	import { Button } from '$lib/components/ui/button';

	let { children } = $props();
</script>

<div class="flex flex-1 flex-col items-center bg-muted/80 md:bg-background">
	<div class="flex w-full max-w-7xl flex-1 p-2 md:hidden">
		<Button class="[&>svg]:size-10" href="/account" variant="ghost">
			<ChevronLeft />
			<span class="ml-1 h-full font-semibold">Booking List</span>
		</Button>
	</div>
	<div class="w-full max-w-7xl flex-1">
		{@render children()}
	</div>
</div>
