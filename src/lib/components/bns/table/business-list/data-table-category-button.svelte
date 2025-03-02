<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { ChevronsUpDown } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let { variant = 'ghost', name, ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<Button {variant} {...restProps}>
	<span>{name}</span>
	<ChevronsUpDown class="ml-2 size-4" />
</Button>
