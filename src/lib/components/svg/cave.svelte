<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className }: { class?: string } = $props();
</script>

<svg
	class={cn(className)}
	xmlns="http://www.w3.org/2000/svg"
	width="480"
	height="480"
	viewBox="0 0 48 48"
>
	<path fill="#F57C00" d="M13,42c0,0,8-35.998,11-35.999S36,42,36,42H13z" />
	<path
		fill="#D84315"
		d="M6,42c0,0,8-28.998,10-28.999s6,14,6,14s1-4,3-4S29,31,29,31s4-13,6-13s8,24,8,24H6z"
	/>
	<path fill="#3E2723" d="M17,42c0-5.523,3.686-10,7-10c3.313,0,7,4.477,7,10H17z" />
</svg>
