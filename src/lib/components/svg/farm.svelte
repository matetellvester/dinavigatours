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
	<path fill="#f44336" d="M37.8,13.7L24,8l-13.8,5.7L6,23h1v19h34V23h1L37.8,13.7z" />
	<path fill="#ff8a80" d="M15,29h18v12H15V29z" />
	<path fill="#fff" d="M20 14h8v8h-8V14zM32 30v10H16V30H32M34 28H14v14h20V28z" />
	<path fill="#fff" d="M23,29h2v13h-2V29z" />
	<path fill="#fff" d="M31.2 41.6L24 30.8 16.8 41.6 15.2 40.4 23.2 28.4 24.8 28.4 32.8 40.4z" />
	<path fill="#b71c1c" d="M39,12L24,6v2l13.8,5.7L39,12z" />
	<path fill="#b71c1c" d="M42 24h2l-5-12-1.2 1.7L42 24zM9 12l15-6v2l-13.8 5.7L9 12z" />
	<path fill="#b71c1c" d="M6,24H4l5-12l1.2,1.7L6,24z" />
	<path fill="#4e342e" d="M22,16h4v4h-4V16z" />
</svg>
