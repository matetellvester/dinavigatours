<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AskQuestion from '$lib/components/svg/ask-question.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { cn } from '$lib/utils';
	import { json } from '@sveltejs/kit';
	import { convoList } from '../state.svelte';
	import type { PageData } from './$types';
	import { toZonedTime, format } from 'date-fns-tz';
	import { SendHorizontal, Loader, RefreshCw } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { RealtimeChannel } from '@supabase/supabase-js';

	interface Props {
		data: PageData;
	}

	let messageContent = $state('');
	let { data }: Props = $props();
	let messages: Message[] | undefined = $state(undefined);
	let previousMessage: Message | null = null;
	let sameAsPrevious: boolean | null = null;
	let ref: HTMLElement | null = $state(null);

	let refreshing = $state(false);

	let channel: RealtimeChannel | null = $state(null);

	let newChat = $state(false);

	let textareaDisable = $state(false);

	let userId = $state('');

	const getTime = (timestamp: string) => format(toZonedTime(timestamp, 'Asia/Manila'), 'hh:mm a');

	$effect(() => {
		if ($page.params.chat) {
			messages = undefined;
			getMessages($page.params.chat);
		}

		// messages = data.conversations.find((c) => c.id.toString() === $page.params.chat)?.messages;
	});

	async function getMessages(convoId: any, reload: boolean = false) {
		if (reload) {
			refreshing = true;
		}

		if ($page.url.searchParams.get('new')) {
			messages = [];
			newChat = true;
			return;
		}
		const response = await fetch('/api/messages?convoId=' + convoId);

		if (!response.ok) {
			console.error('Error sa pag kuha sa messeges with convoId: ' + convoId);
		}

		const res = await response.json();

		const data = res.data as Message[];

		if (!data[0]) {
			toast.error('Conversation not found');
			await goto('/chats');
			return;
		}

		if (!reload) {
			userId = data[0].senderId;
			previousMessage = null;
		}

		newChat = false;
		await tick();
		messages = data;

		newChatChannel(convoId);

		// if (reload) {
		refreshing = false;
		await tick();
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: 'smooth' // For smooth scrolling
		});
		// }
	}

	async function newChatChannel(convoId: any) {
		if (channel) {
			channel.unsubscribe();
		}

		channel = data.supabase
			.channel(`convo_${convoId}`)
			.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (e) => {
				const message = e.new as Message;

				if (message.convoId === Number(convoId)) {
					messages?.push(message);

					tick().then(() => {
						window.scrollTo({
							top: document.body.scrollHeight,
							behavior: 'smooth'
						});
					});
				}
			})
			.subscribe();
	}

	function check(message: Message) {
		sameAsPrevious =
			previousMessage &&
			(previousMessage.senderId !== message.senderId ||
				previousMessage.receiverId !== message.receiverId);

		previousMessage = message;
		return sameAsPrevious ?? true;
	}

	async function send() {
		textareaDisable = true;

		if ($page.url.searchParams.get('new')) {
			const res = await fetch('/api/convo/new', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ lstngId: $page.params.chat, messageContent })
			});

			if (!res.ok) {
				console.error('Error sa pag create og new convo');
			}

			newChat = false;
			const result = await res.json();

			// convoList.add(result.convoInfo);

			textareaDisable = false;
			messageContent = '';

			await tick();
			ref?.focus();

			await goto('/chats/' + result.data.convoId);

			ref?.focus();
			return;
		}

		// KUNG DILI NEW MESSAGE

		const currItem = convoList.value?.find(
			(c) => c.messages.convoId.toString() === $page.params.chat
		);

		const res = await fetch('/api/messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				convoId: currItem?.messages.convoId,
				receiverId: currItem?.receiver.userId,
				messageContent
			})
		});

		if (!res.ok) {
			console.error('Error sa pag create og new convo');
		}

		const result = await res.json();

		// console.log(result);

		// messages?.push(result.data);
		messageContent = '';

		textareaDisable = false;
		await tick();
		ref?.focus();
	}

	function handleEnter(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
			send();
		}
	}

	onMount(() => {
		return () => {
			if (channel) {
				channel.unsubscribe();
			}
		};
	});
</script>

<div class="relative flex h-full w-full flex-1 flex-col text-wrap">
	{#if messages}
		<!-- <div class="messages flex flex-1 flex-col space-y-1 px-4 pb-32 text-background sm:px-6 md:px-8"> -->
		<div class="messages flex flex-1 flex-col space-y-1 px-4 pb-4 text-background sm:px-6 md:px-8">
			{#each messages as message}
				{@const same = check(message)}
				{@const isSender = message.senderId === userId}
				<!-- {@const senderClass = roundedClass(same, isSender)} -->
				<div
					class="flex w-full flex-col overflow-hidden break-words
          {isSender
						? 'sender items-end justify-end [&:has(+_.receiver)_.message]:rounded-br-[2rem] [&:has(+_.sender.time)_.message]:rounded-br-[2rem] '
						: 'receiver items-start justify-start [&:has(+_.receiver_.time)_.message]:rounded-bl-[2rem] [&:has(+_.sender)_.message]:rounded-bl-[2rem]'}"
				>
					{#if same}
						<span class="time mb-2 mt-6 block w-full text-center text-muted-foreground/70">
							{getTime(message.timestamp)}
						</span>
					{/if}

					<div
						class="message block max-w-[85%] overflow-hidden break-words py-3 leading-none
          {isSender
							? 'rounded-r-md rounded-s-[2rem] bg-primary pl-4 pr-3 text-right'
							: 'rounded-e-[2rem] rounded-s-md bg-muted-foreground/80 pl-3 pr-4'}"
					>
						{message.messageContent}
					</div>
				</div>
			{/each}

			{#if newChat}
				<div class="flex flex-col items-center">
					<AskQuestion class="mt-20 size-40" />
					<p class="font-medium text-muted-foreground">No messages yet.</p>
					<p class="text-sm text-foreground">Type a message to start the conversation.</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class=" flex flex-1">
			<Loader class="m-auto animate-spin" />
		</div>
	{/if}

	<!-- class="fixed bottom-[64px] flex w-[calc(100%-20rem)] flex-1 space-x-2 text-wrap border-t-2 bg-background p-4 max-md:w-full md:bottom-0" -->
	<div class="flex space-x-2 text-wrap border-t-2 bg-background p-4 max-md:w-full md:bottom-0">
		<Textarea
			bind:ref
			bind:value={messageContent}
			disabled={textareaDisable}
			onkeydown={handleEnter}
			class="h-[80px] w-full flex-1"
			placeholder="Your message"
		/>

		<div class="mt-auto flex h-full flex-col justify-between">
			<!-- <button
				class="disabled:opacity-50"
				disabled={refreshing}
				onclick={() => getMessages($page.params.chat, true)}
			>
				<RefreshCw class={refreshing ? 'animate-spin' : ''} />
			</button> -->

			<button
				class="mt-auto disabled:opacity-50"
				onclick={send}
				disabled={messageContent.trim() == '' || textareaDisable}
			>
				<SendHorizontal class="-translate-y-1 -rotate-45" />
			</button>
		</div>
	</div>
</div>

<style lang="postcss">
	.receiver:has(.time) .message {
		@apply rounded-tl-[32px];
	}
	.receiver:last-child .message {
		@apply rounded-bl-[2rem];
	}

	.sender:has(.time) .message {
		@apply rounded-tr-[32px];
	}

	.sender:last-child .message {
		@apply rounded-br-[2rem];
	}
</style>
