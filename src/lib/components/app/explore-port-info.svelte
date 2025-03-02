<script lang="ts">
	interface Props {
		info: string | null;
		link: string;
	}

	let { info, link }: Props = $props();
</script>

{#if info !== null}
	<div class="mt-6 flex items-center">
		<span class="h-6 w-2 rounded-full bg-primary"></span>
		<h1 class="px-4 py-2 text-xl font-bold text-foreground">How to get here</h1>
	</div>

	<div class="px-2 text-lg leading-6">{info}</div>
{/if}

<iframe
	class="my-4 w-full"
	title="Port Location"
	src={link}
	height="450"
	style="border:0;"
	loading="lazy"
	referrerpolicy="no-referrer-when-downgrade"
></iframe>
