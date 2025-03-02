<script lang="ts">
	import { Moon, Sun, Loader } from 'lucide-svelte';
	import { toggleMode, mode } from 'mode-watcher';
	import { fade } from 'svelte/transition';

	let { type = 'switch' }: { type?: 'switch' | 'toggle' } = $props();
</script>

{#if type === 'switch'}
	<button
		onclick={toggleMode}
		class="flex w-11 items-center rounded-full border bg-muted p-0.5 transition-colors duration-300"
		aria-label="Toggle theme"
	>
		<div
			class="flex h-5 w-5 transform items-center justify-center rounded-full bg-background p-1 shadow transition-transform duration-300
  		{$mode == undefined ? 'translate-x-[0.6rem] bg-transparent' : ''}"
			class:translate-x-[1.20rem]={$mode === 'dark'}
		>
			{#if $mode === 'dark'}
				<span in:fade class="size-4"><Moon class="h-full w-full text-foreground" /></span>
			{:else if $mode === 'light'}
				<span in:fade class="size-4"><Sun class="h-full w-full text-foreground" /></span>
			{:else}
				<Loader class="animate-spin" />
			{/if}
		</div>
	</button>
{:else}
	<button
		onclick={toggleMode}
		class="flex items-center rounded-full border bg-muted p-2 transition-colors duration-300 [&_svg]:size-5"
		aria-label="Toggle theme"
	>
		{#if $mode === 'dark'}
			<span in:fade><Moon class="h-full w-full text-foreground" /></span>
		{:else if $mode === 'light'}
			<span in:fade><Sun class="h-full w-full text-foreground" /></span>
		{:else}
			<Loader class="animate-spin" />
		{/if}
	</button>
{/if}
