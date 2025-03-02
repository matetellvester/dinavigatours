<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className }: { class?: string } = $props();
</script>

<svg class={cn(className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
	><path fill="#1e88e5" d="M23,5H8C6.9,5,6,5.9,6,7v22h19V7C25,5.9,24.1,5,23,5z" /><path
		fill="#0d47a1"
		d="M14 9h-4v4h4V9zM14 16h-4v4h4V16zM14 23h-4v4h4V23z"
	/><path fill="#1976d2" d="M6 29H25V31H6z" /><path
		fill="#90caf9"
		d="M16,41h26V11c0-1.1-0.9-2-2-2H18c-1.1,0-2,0.9-2,2V41z"
	/><path fill="#64b5f6" d="M42,41H16v2h26V41z" /><path
		fill="#1565c0"
		d="M31 35h-4v4h4V35zM38 35h-4v4h4V35zM24 35h-4v4h4V35zM31 21h-4v4h4V21zM38 21h-4v4h4V21zM24 21h-4v4h4V21zM31 28h-4v4h4V28zM38 28h-4v4h4V28zM24 28h-4v4h4V28zM31 14h-4v4h4V14zM38 14h-4v4h4V14zM24 14h-4v4h4V14z"
	/></svg
>
