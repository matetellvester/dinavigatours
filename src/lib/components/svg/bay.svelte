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
	<rect width="40" height="19" x="4.012" y="23" fill="#ffc107" />
	<path
		fill="#2196f3"
		d="M44.012,42c0,0-21-1-21-5c0-2,2-1.324,2-3c0-3.104-14-2-14-6c0-5,33-5,33-5V42z"
	/>
	<polygon
		fill="#8d6e63"
		points="4.012,6 4.012,23 44.012,23 44.012,21 35.012,17 27.012,16 21.012,10"
	/>
	<polygon fill="#6d4c41" points="16.012,14 16.012,20 20.012,13 18.012,12" />
	<polygon fill="#6d4c41" points="27.012,16 25.012,21 30.209,16.4" />
	<polygon fill="#6d4c41" points="4.012,6 4,19 6.012,15 6.012,11 7.89,6.912" />
	<polygon
		fill="#6d4c41"
		points="9.012,20 10.012,16 12.012,15 11.012,17 11.012,20 10.012,23 7.012,23"
	/>
</svg>
