<script lang="ts">
	import { page } from '$app/stores';
	import ConvItem from '$lib/components/conversation/conv-item.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { AlignLeft } from 'lucide-svelte';
	import { onMount, tick, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { convoList } from './state.svelte';

	interface Props {
		data: LayoutData;
		children: Snippet<[]>;
	}

	let selectedName = $state('');
	let open = $state(false);
	// svelte-ignore non_reactive_update
	// let sender: AppUser;

	// let currentPage = $derived($page.route.id?.split('/')[3]);

	let { children }: Props = $props();

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
</script>

<div class="relative flex h-full">
	<div
		style="overflow: auto;"
		class="fixed top-14 z-30 hidden h-full w-80 truncate border-r p-2 md:block"
	>
		<div class="h-full flex-1">
			{#if convoList.value}
				{#each convoList.value as conversation}
					<ConvItem
						lstngName={conversation.lstngName}
						conversationId={conversation.id}
						sender={conversation.sender}
						receiver={conversation.receiver}
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

	<div class="flex h-full flex-1 flex-col md:pl-80">
		<div
			class="sticky top-0 z-10 w-full border-b bg-background p-2
      {!$page.url.searchParams.get('new') && !selectedName.trim()
				? 'md:hidden'
				: 'block md:hidden'}"
		>
			<div class="flex min-h-10 items-center">
				<Button onclick={() => (open = true)} variant="ghost" class="md:hidden">
					<AlignLeft />
				</Button>
				<span class="ml-2">{$page.url.searchParams.get('new') || selectedName}</span>
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

<Sheet.Root bind:open>
	<Sheet.Content side="left" class="overflow-auto p-0 [&>[data-dialog-close]]:hidden">
		<Sheet.Header>
			<Sheet.Title class="sticky top-0 z-10 flex items-center bg-background px-4 pt-4">
				<span>Chats</span>
				<Button onclick={() => (open = false)} variant="ghost" class="ml-auto">
					<AlignLeft class="scale-x-[-1] transform" />
				</Button>
			</Sheet.Title>
			<Sheet.Description class="p-4 pl-3 text-left">
				<div class="h-full w-full">
					{#if convoList.value}
						{#each convoList.value as conversation}
							<ConvItem
								lstngName={conversation.lstngName}
								conversationId={conversation.id}
								sender={conversation.sender}
								receiver={conversation.receiver}
								message={conversation.messages}
								onclick={async () => {
									// sender = conversation.sender;
									selectedName = conversation.lstngName;
									await tick();
									open = false;
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
			</Sheet.Description>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
