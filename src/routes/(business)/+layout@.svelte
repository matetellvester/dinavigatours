<script lang="ts">
	import BnsSidebar from '$lib/components/bns/bns-sidebar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Bell, Loader } from 'lucide-svelte';
	import { scale } from 'svelte/transition';
	import { bnsHeader } from './b/bns.svelte.js';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	let isLoggingOut = $state(false);

	let open = $state(false);

	type Notif = {
		id: number;
		created_at: string;
		user_id: string;
		title: string;
		content: string;
		read: boolean;
	};

	type NotifState = {
		val: Notif[] | null;
		add: (notif: Notif) => void;
		update: (notif: Notif) => void;
	};

	const notifs: NotifState = $state({
		val: [] as Notif[],
		add(notif) {
			this.val = [notif, ...this.val];
		},
		update(notif) {
			this.val = this.val.map((n) => (n.id === notif.id ? { ...n, read: true } : n));
		}
	});

	let unreadNotif = $derived.by(() => {
		if (!notifs.val) return [];
		return notifs.val.filter((n) => !n.read);
	});

	const readNotifs = async () => {
		unreadNotif.forEach(async (n) => {
			const { error, data: notifData } = await data.supabase
				.from('notification')
				.update({
					read: true
				})
				.eq('id', n.id);

			if (error) {
				console.error('Naay error while nag update sa read, with id: ', n.id);
			}

			notifs.update(n);
		});
	};

	onMount(async () => {
		if (data.user !== null) {
			const { data: notifData, error } = await data.supabase
				.from('notification')
				.select('*')
				.eq('user_id', data.user.id);

			if (error) {
				console.error('Naay error sa pag kuha sa notifs: ', error);
				return;
			}
			notifs.val = notifData;
		}
	});

	onMount(() => {
		if (!data.user) return;

		data.supabase
			.channel('test-table-changes')
			.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notification' }, (e) => {
				// console.log(e);

				const newNotif = e.new as Notif;

				if (newNotif.user_id === data.user?.id) {
					notifs.add(newNotif);
				}
			})
			.subscribe();
	});
</script>

<svelte:head>
	<title>Dashboard | Business Owner</title>
</svelte:head>

<Sidebar.Provider>
	<BnsSidebar user={data.user} />
	<Sidebar.Inset>
		<header
			class="sticky top-0 z-[1] flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4"
		>
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<h2 class="text-3xl font-bold tracking-tight">{bnsHeader.v}</h2>

			{#if data.user}
				<div class="relative ml-auto">
					{#if unreadNotif.length}
						<div
							transition:scale
							class="absolute right-3 top-2.5 size-2 rounded-full bg-red-500"
						></div>
					{/if}

					<Button class="rounded-full p-3" variant="secondary" onclick={async () => (open = true)}>
						<Bell />
					</Button>
				</div>
			{/if}
			<div class="flex items-center space-x-2">
				{#if !data.user}
					<Button size="sm" variant="outline" href="/login">Login</Button>
					<Button size="sm" href="/signup">Sign up</Button>
				{:else}
					<form action="/logout" method="POST">
						<!-- <form action="/logout" method="POST" use:enhance={handleSubmit}> -->
						<Button size="sm" type="submit" disabled={isLoggingOut}>
							{#if isLoggingOut}
								<Loader class="animate-spin" />
							{/if}
							<span class="h-6">Logout</span>
						</Button>
					</form>
				{/if}
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-4">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>

<Sheet.Root bind:open onOpenChange={readNotifs}>
	<Sheet.Content side="right" class="px-0 pt-3">
		<Sheet.Header class="border-b px-4 pb-2">
			<Sheet.Title>Booking Notifications</Sheet.Title>
		</Sheet.Header>

		<ScrollArea class="h-full px-4">
			<div class="mt-2 space-y-4 divide-y pb-4">
				{#if notifs.val}
					{#each notifs.val as notif}
						{@render notifyCard(notif)}
					{:else}
						<span class="text-muted-foreground text-center">No notification yet</span>
					{/each}
				{:else}
					<Loader class="animate-spin" />
				{/if}
			</div>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>

{#snippet notifyCard(notif: Notif)}
	<a href="/b/book" onclick={() => (open = false)} class="block pt-2">
		<h1 class="font-semibold">{notif.title}</h1>
		<div class="text-muted-foreground">
			{notif.content}
		</div>
	</a>
{/snippet}
