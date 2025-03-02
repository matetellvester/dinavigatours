<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className }: { class?: string } = $props();
</script>

<svg
	class={cn(className)}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 48 48"
	width="480"
	height="480"
>
	<path fill="#90a4ae" d="M0 22H48V26H0z" />
	<path
		fill="#e64a19"
		d="M42,34c0,0.553-0.447,1-1,1h-3c-0.553,0-1-0.447-1-1V14c0-0.553,0.447-1,1-1h3c0.553,0,1,0.447,1,1V34z"
	/>
	<path
		fill="#ff754c"
		d="M37,38c0,0.553-0.447,1-1,1h-3c-0.553,0-1-0.447-1-1V10c0-0.553,0.447-1,1-1h3c0.553,0,1,0.447,1,1V38z"
	/>
	<path
		fill="#e64a19"
		d="M6,34c0,0.553,0.447,1,1,1h3c0.553,0,1-0.447,1-1V14c0-0.553-0.447-1-1-1H7c-0.553,0-1,0.447-1,1V34z"
	/>
	<path
		fill="#ff754c"
		d="M11,38c0,0.553,0.447,1,1,1h3c0.553,0,1-0.447,1-1V10c0-0.553-0.447-1-1-1h-3c-0.553,0-1,0.447-1,1V38z"
	/>
	<path fill="#607d8b" d="M2 22.122H4V26.122H2zM44 22H46V26H44z" />
</svg>
