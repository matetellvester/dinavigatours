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
	<path fill="#8e24aa" d="M6,36h36v6H6V36z" />
	<path
		fill="#ffb74d"
		d="M16 32c0-2.2-1.8-4-4-4s-4 1.8-4 4c0 2.2 1.8 4 4 4S16 34.2 16 32M38 33c0 1.7-1.3 3-3 3H21c-1.7 0-3-1.3-3-3v-1c0-1.7 1.3-3 3-3h14c1.7 0 3 1.3 3 3V33zM33.3 13.8c2.1-.7 3.2-3 2.5-5.1s-3-3.2-5.1-2.5c-2.1.7-3.2 3-2.5 5.1S31.2 14.5 33.3 13.8"
	/>
	<path
		fill="#ffb74d"
		d="M15.9,42H8c-1.1,0-2-0.9-2-2s0.9-2,2-2h6.1l4.4-5.3c0.7-0.8,2-1,2.8-0.3c0.8,0.7,1,2,0.3,2.8 L15.9,42z"
	/>
	<path fill="#ce93d8" d="M31,29h11v13H31V29z" />
	<path
		fill="#1565c0"
		d="M25,29c-0.5,0-0.9-0.2-1.3-0.5c-0.8-0.7-0.9-2-0.2-2.8l8-9c0.7-0.8,2.5-1.5,3.7-1.7 c1.1-0.1,0,3.5-0.7,4.3l-8,9C26.1,28.8,25.6,29,25,29z"
	/>
	<path
		fill="#1565c0"
		d="M34.6,29H42l-3.6-12c-0.5-1.6-2.2-2.4-3.8-1.9l-0.9,0.3c-1.6,0.5-2.4,2.2-1.9,3.8L34.6,29z"
	/>
</svg>
