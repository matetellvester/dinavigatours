<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle/index.js';
	import Ok from '$lib/components/svg/ok.svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		name,
		title,
		pressed = $bindable(false)
	}: { class?: string; name: string; title: string; pressed?: boolean } = $props();

	const theClass = cn(
		'group data-[state=on]:bg-primary/5 data-[state=on]:border-primary active:scale-[99%] hover:bg-transparent hover:text-foreground border hover:border-primary'
	);
</script>

<div class={cn(className)}>
	{#if pressed !== undefined}
		<div class="size-0 overflow-hidden opacity-0 [&>input]:size-0 [&>input]:opacity-0">
			<input type="hidden" {name} aria-label={name} value={pressed ? 1 : 0} />
		</div>
	{/if}

	<Toggle bind:pressed class={theClass}>
		<div class="rounded-full bg-primary/10">
			<Ok class="transition-opacity {pressed ? 'opacity-100' : 'opacity-0'}" />
		</div>
		<span>{title}</span>
	</Toggle>
</div>
