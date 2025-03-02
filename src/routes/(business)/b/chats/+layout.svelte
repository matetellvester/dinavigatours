<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import ConvItem from '$lib/components/conversation/conv-item.svelte';
	import { AlignLeft } from 'lucide-svelte';
	import { convoList } from './state.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	interface Props {
		data: LayoutData;
		children: Snippet<[]>;
	}

	let { data, children }: Props = $props();

	let selectedName = $state('');

	onMount(async () => {
		const res = await fetch('/api/convo');
		if (!res.ok) {
			console.error('There is an error fetching conversations');
		}
		const result = await res.json();

		convoList.value = result.data;
	});

	$effect(() => {
		if (!$page.params.chat) {
			selectedName = '';
		}
	});

	function getName(user: AppUser) {
		return user.name.last_name + ', ' + user.name.first_name;
	}
</script>

<div class="relative flex h-full">
	<div
		style="overflow: auto;"
		class="fixed top-16 z-30 h-[calc(100vh-4.1rem)] w-80 truncate border-r p-2"
	>
		<div class="h-full flex-1">
			{#if convoList.value}
				{#each convoList.value as conversation}
					<ConvItem
						operator
						lstngName={getName(conversation.sender)}
						conversationId={conversation.id}
						sender={conversation.receiver}
						receiver={conversation.sender}
						message={conversation.messages}
						onclick={() => {
							// sender = conversation.sender;
							selectedName = conversation.lstngName;
						}}
					/>
				{/each}
			{:else}
				<div class="w-full space-y-2">
					<Skeleton class="h-20" />
					<Skeleton class="h-20" />
					<Skeleton class="h-20" />
					<Skeleton class="h-20" />
				</div>
			{/if}
		</div>
	</div>

	<div class="flex h-full flex-1 flex-col pl-80">
		<div
			class="sticky top-0 z-10 w-full border-b bg-background p-2
      {!$page.url.searchParams.get('new') && !selectedName.trim() ? 'hidden' : 'block'}"
		>
			<div class="flex min-h-10 items-center">
				<span class="px-2">{$page.url.searchParams.get('new') || selectedName}</span>
				{#if $page.url.searchParams.get('new')}
					<Badge class="ml-2" variant="secondary">new</Badge>
				{/if}
			</div>
		</div>
		<div class="flex-1">
			{@render children()}
		</div>
	</div>
</div>
