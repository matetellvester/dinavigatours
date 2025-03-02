<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { getFallbackAvatar, getFirstLetters } from '$lib/utils';
	import { page } from '$app/stores';

	import { toZonedTime, format } from 'date-fns-tz';

	interface Props {
		/** Conversation ID */
		conversationId: number;
		/**
		 * Malahi ang link kung operator
		 */
		operator?: boolean;
		lstngName: string;
		sender: AppUser;
		receiver: AppUser;

		/**Message*/
		message: Message;

		onclick: () => void;
	}

	let { conversationId, lstngName, sender, operator, receiver, message, onclick }: Props = $props();

	let chatOpen = $derived($page.params.chat === conversationId.toString());

	const { name: senderName } = sender;

	const href = `${operator ? '/b' : ''}/chats/` + conversationId;
</script>

<div class="w-full truncate rounded-lg {chatOpen ? 'bg-accent' : ''}">
	<a {href} {onclick} class="">
		<div
			class="flex w-full space-x-1 truncate p-4
      {chatOpen ? 'text-foreground' : 'text-muted-foreground'}"
		>
			<Avatar.Root>
				<Avatar.Image src={getFallbackAvatar()} alt={lstngName} />
				<Avatar.Fallback>
					{getFirstLetters(senderName.last_name, senderName.first_name)}
				</Avatar.Fallback>
			</Avatar.Root>

			<div class="flex flex-1 flex-col justify-center truncate">
				<span class="block font-medium leading-4">{lstngName}</span>
				<span class="truncate text-nowrap text-sm leading-4 opacity-70">
					{message.messageContent}
				</span>
			</div>

			<div class="flex flex-col items-end py-1">
				<span class="text-sm leading-4">
					{format(toZonedTime(message.timestamp, 'Asia/Manila'), 'hh:mm a')}
				</span>
				{#if message.status === 'unread'}
					<span class="size-3 rounded-full bg-blue-500 md:size-2"></span>
				{/if}
			</div>
		</div>
	</a>
</div>
