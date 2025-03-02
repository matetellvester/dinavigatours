<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '../ui/button/button.svelte';
	const selectedClassName = cn('border-primary bg-primary/5 text-primary');

	let selected: 'join' | 'private' | null = $state(null);
</script>

<div class="mt-6 rounded-lg bg-muted-foreground/5 p-4 shadow-sm ring-1 ring-inset ring-border">
	<div class="flex">
		<h1 class="text-lg font-semibold text-foreground">Select Option</h1>
		<button
			type="button"
			class="ml-auto text-lg text-foreground underline"
			onclick={() => (selected = null)}>Reset</button
		>
	</div>
	<span>Join-in tour or private tour</span>
	<div class="mt-2 font-semibold transition-colors">
		<Button
			type="button"
			variant="outline"
			onclick={() => (selected = 'join')}
			class="rounded-lg
      {selected === 'join' ? selectedClassName : ''}">Join-In Tour</Button
		>
		<Button
			type="button"
			variant="outline"
			onclick={() => (selected = 'private')}
			class="rounded-lg {selected === 'private' ? selectedClassName : ''}">Private Tour</Button
		>
	</div>
</div>
