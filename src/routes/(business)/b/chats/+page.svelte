<script lang="ts">
	import type { PageData } from './$types';
	import Chats from '$lib/components/svg/chats.svelte';
	import { onMount } from 'svelte';
	import { bnsHeader } from '../bns.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	onMount(() => {
		bnsHeader.v = 'Chats';
	});
</script>

<svelte:head>
	<title>Chat</title>
</svelte:head>

<div class="flex h-full items-center justify-center">
	<div class="-translate-y-20 text-center">
		<Chats class="mt-20 size-40" />
		<div class="mt-2 block text-lg text-muted-foreground">No open chat</div>
	</div>
</div>
