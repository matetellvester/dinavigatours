<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import MapImageSteps from './map-image-steps.svelte';

	interface Props {
		open?: boolean;
	}

	let { open = $bindable(false) }: Props = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="flex h-[calc(100%_-_100px)] w-[calc(100%_-_100px)] max-w-5xl flex-col">
		<Dialog.Header>
			<Dialog.Title>How to add link</Dialog.Title>
		</Dialog.Header>
		<div class="size-full">
			<Tabs.Root value="existing" class="w-full">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="existing">Existing Location</Tabs.Trigger>
					<Tabs.Trigger value="non-exist">New/Unlisted Location</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="existing">
					<MapImageSteps stepType="exist" />
				</Tabs.Content>
				<Tabs.Content value="non-exist">
					<MapImageSteps stepType="non-exist" />
				</Tabs.Content>
			</Tabs.Root>
		</div>
		<Dialog.Footer>
			<Dialog.DialogClose class={buttonVariants({ variant: 'outline' })}>Close</Dialog.DialogClose>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
