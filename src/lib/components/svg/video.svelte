<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className }: { class: string | null | undefined } = $props();
</script>

<svg class={cn(className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
	<path
		fill="#3f51b5"
		d="M45,8H3v32h42V8z M22,34h4v4h-4V34z M30,34h4v4h-4V34z M38,34h4v4h-4V34z M14,34h4v4h-4V34z M6,34h4 v4H6V34z M22,10h4v4h-4V10z M30,10h4v4h-4V10z M38,10h4v4h-4V10z M14,10h4v4h-4V10z M6,10h4v4H6V10z"
	/><path fill="#80d8ff" d="M21,18v12l10-5.479L21,18z" /></svg
>
