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
	<path fill="#795548" d="M33,37c-2.383,0-21,0-21,0l-6-5v-4h36C42,28,36,37,33,37z" />
	<path fill="#795548" d="M40 28L44 28 44 29 40 30z" />
	<path fill="#BBDEFB" d="M37,25l-17,2c4-7,0-20,0-20S33,9,37,25z" />
	<path fill="#5D4037" d="M40.581,30H6v2h33.032C39.605,31.291,40.135,30.604,40.581,30z" />
	<path
		fill="#90CAF9"
		d="M44,36c-3,0-4-2-4-2s-1,2-4,2s-4-2-4-2s-1,2-4,2s-4-2-4-2s-1,2-4,2s-4-2-4-2s-1,2-4,2s-4-2-4-2s-1,2-4,2v8h4h32h4V36z"
	/>
	<path
		fill="#2196F3"
		d="M44,40c-3,0-4-2-4-2s-1,2-4,2s-4-2-4-2s-1,2-4,2s-4-2-4-2s-1,2-4,2s-4-2-4-2s-1,2-4,2s-4-2-4-2s-1,2-4,2v4h4h32h4V40z"
	/>
	<path fill="#90A4AE" d="M20 5L18 5 18 28 20 28z" />
	<path
		fill="#FF3D00"
		d="M18,3.245V6c3.917-1.417,7.584,2.245,10-2.755C23.834,6.081,21.667,1.995,18,3.245z"
	/>
</svg>
