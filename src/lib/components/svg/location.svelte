<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className }: { class?: string } = $props();
</script>

<svg class={cn(className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
	<path
		fill="#ff3d00"
		d="M24,1C15.2,1,6.015,7.988,6,18C5.982,29.981,24,48,24,48s18.019-17.994,18-30 C41.984,8.003,32.8,1,24,1z M24,26c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S28.418,26,24,26z"
	/>
</svg>
