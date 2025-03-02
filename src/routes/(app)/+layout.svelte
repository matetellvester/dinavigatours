<script lang="ts">
	import { page } from '$app/stores';
	import Favicon from '$lib/components/svg/favicon.svelte';
	import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { isDesktop } from '$lib/hooks/is-mobile.svelte';
	import { Bell, Calendar, CircleUser, Compass, House, Loader, MessageCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { userLogin } from './global.app.svelte.js';

	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { scale } from 'svelte/transition';

	let { data, children } = $props();

	let open = $state(false);

	const buttons: { icon: any; href: string; label: string }[] = [
		{ icon: House, href: '/', label: 'Home' },
		{ icon: Compass, href: '/explore', label: 'Explore' },
		{ icon: Calendar, href: '/events', label: 'Events' },
		{ icon: MessageCircle, href: '/chats', label: 'Chat' },
		{ icon: CircleUser, href: '/account', label: 'Account' }
	];

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
			userLogin.value = true;

			const { data: notifData, error } = await data.supabase
				.from('notification')
				.select('*')
				.eq('user_id', data.user.id);

			if (error) {
				console.error('Naay error sa pag kuha sa notifs: ', error);
				return;
			}

			notifs.val = notifData;
		} else {
			userLogin.value = false;
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

{#if isDesktop.current}
	<div class="fixed top-0 z-50 flex w-full border-b">
		<header
			class="mx-auto flex h-14 w-full max-w-7xl shrink-0 items-center gap-2 bg-background px-4 xl:px-0"
		>
			<div class="flex h-full w-full items-center text-muted-foreground">
				<a href="/">
					<Favicon class="mr-4 size-10 dark:invert" />
				</a>
				{#each buttons as { label, href }}
					<div
						data-active={'/' + $page.url.pathname.split('/')[1] === href}
						class="group flex h-full border-transparent data-[active=true]:text-primary"
					>
						<Button
							{href}
							variant="ghost"
							class="p-auto m-auto flex flex-col px-2 font-semibold hover:bg-transparent group-data-[active=true]:text-primary [&_svg]:size-6"
						>
							<!-- <Icon /> -->
							<span class="text-md leading-[4px]">{label}</span>
						</Button>
					</div>
				{/each}
			</div>
			<div class="ml-auto flex h-full items-center space-x-2 py-2">
				{#if data.user}
					<div class="relative">
						{#if unreadNotif.length}
							<div
								transition:scale
								class="absolute right-3 top-2.5 size-2 rounded-full bg-red-500"
							></div>
						{/if}

						<Button
							class="rounded-full p-3"
							variant="secondary"
							onclick={async () => (open = true)}
						>
							<Bell />
						</Button>
					</div>
				{/if}
				<div>
					<ThemeSwitcher type="toggle" />
				</div>
				{#if !data.user}
					<Button size="sm" variant="outline" href="/login">Login</Button>
					<Button size="sm" href="/signup">Sign up</Button>
				{:else}
					<form action="/logout" method="POST">
						<Button size="sm" type="submit">Logout</Button>
					</form>
				{/if}
			</div>
		</header>
	</div>
{:else}
	<header
		class="fixed bottom-0 z-[1] flex h-16 w-full shrink-0 items-center gap-2 border-b bg-background"
	>
		<div class="flex h-full w-full items-center justify-around border-t text-muted-foreground">
			{#each buttons as { icon: Icon, label, href }}
				<div
					data-active={'/' + $page.url.pathname.split('/')[1] === href}
					class="group flex h-full border-t-2 border-transparent data-[active=true]:border-foreground"
				>
					<Button
						{href}
						variant="ghost"
						class="p-auto m-auto flex flex-col px-1 hover:bg-transparent group-data-[active=true]:text-foreground [&_svg]:size-6"
					>
						<Icon />
						<span class="text-xs leading-[4px]">{label}</span>
					</Button>
				</div>
			{/each}
		</div>
	</header>
{/if}

<div
	class="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl flex-1 flex-col md:h-[calc(100vh-3.5rem)] md:pb-0 md:pt-14"
>
	{@render children()}
</div>

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
	<a href="/booking-list" onclick={() => (open = false)} class="block pt-2">
		<h1 class="font-semibold">{notif.title}</h1>
		<div class="text-muted-foreground">
			{notif.content}
		</div>
	</a>
{/snippet}
