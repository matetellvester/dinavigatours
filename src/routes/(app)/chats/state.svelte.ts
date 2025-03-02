type Convos = ConversationInfo & {
	messages: Message & { convoId: number };
};

type ConvoList = {
	value: Convos[] | null;
	add: (convo: Convos) => void;
};

export const convoList = $state<ConvoList>({
	value: null,
	add(convo) {
		this.value = [convo, ...(this.value ?? [])];
	}
});
