<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className }: { class?: string | null | undefined } = $props();
</script>

<svg
	class={cn(className)}
	xmlns="http://www.w3.org/2000/svg"
	width="48"
	height="48"
	viewBox="0 0 48 48"
	><path fill="#d18a2e" d="M38,16.5h3V44h-3V16.5z" /><path
		fill="#d18a2e"
		d="M7,16.5h3V44H7V16.5z"
	/><path fill="#d18a2e" d="M6,40h36v4H6V40z" /><path
		fill="#795548"
		d="M38,14.125h3V23h-3V14.125z"
	/><path fill="#795548" d="M7,14.125h3V23H7V14.125z" /><path
		fill="#558b2f"
		d="M24,15c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S25.657,15,24,15z M36,15c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S37.657,15,36,15z M12,15c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S13.657,15,12,15z"
	/><path fill="#7cb342" d="M21,6h6v12h-6V6z M37,6h-5l1,12h6L37,6z M11,6h5l-1,12H9L11,6z" /><path
		fill="#ffa000"
		d="M30,15c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S31.657,15,30,15z M45,18c0,1.7-1.3,3-3,3 s-3-1.3-3-3s1.3-3,3-3L45,18z M18,15c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S19.657,15,18,15z M3,18c0,1.7,1.3,3,3,3 s3-1.3,3-3s-1.3-3-3-3L3,18z"
	/><path
		fill="#ffc107"
		d="M32,6h-5v12h6L32,6z M42,6h-5l2,12h6L42,6z M16,6h5v12h-6L16,6z M6,6h5L9,18H3L6,6z"
	/><path fill="#ffab40" d="M5,30h38v12H5V30z" /></svg
>
