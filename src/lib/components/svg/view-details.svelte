<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className }: { class?: string } = $props();
</script>

<svg class={cn(className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
	<path fill="#BBDEFB" d="M7 4H41V44H7z" />
	<path
		fill="#2196F3"
		d="M13 26H17V30H13zM13 18H17V22H13zM13 34H17V38H13zM13 10H17V14H13zM21 26H35V30H21zM21 18H35V22H21zM21 34H35V38H21zM21 10H35V14H21z"
	/>
</svg>
