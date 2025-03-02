<script lang="ts" module>
	import {
		ClipboardList,
		LayoutDashboard,
		LayoutList,
		MessageCircle,
		Moon,
		Plus,
		Sun
	} from 'lucide-svelte';

	const data = {
		main: [
			{
				title: 'Dashboard',
				href: '/b',
				icon: LayoutDashboard
			},
			{
				title: 'My Listing',
				href: '/b/list',
				action: '/b/list/new',
				icon: LayoutList
			},
			{
				title: 'Booking',
				href: '/b/book',
				icon: ClipboardList
			},
			{
				title: 'Chats',
				href: '/b/chats',
				icon: MessageCircle
			}
		]
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { onMount, type ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user: User | null } = $props();

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { getFallbackAvatar } from '$lib/utils';
	import type { User } from '@supabase/supabase-js';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import LogOut from 'lucide-svelte/icons/log-out';
	import { mode, toggleMode } from 'mode-watcher';

	const sidebar = useSidebar();

	let name = $state({ name: '', src: '' });

	onMount(async () => {
		const response = await fetch('/api/userlist/' + user?.id);

		if (!response.ok) return;

		const res = (await response.json()).data as {
			first_name: string;
			last_name: string;
			gender: string;
		};

		name = {
			name: `${res.last_name}, ${res.first_name}`,
			src: getFallbackAvatar(res.gender as 'male' | 'female')
		};
	});
</script>

<Sidebar.Root bind:ref {...restProps}>
	<Sidebar.Header>
		<Sidebar.Header>
			<div class="items flex pt-4">
				<img src="/favicon.png" alt="dinavigatour icon" class="size-10" />
				<h1 class="h-full px-2 font-poppins text-2xl font-extrabold">Dinavigatours</h1>
			</div>
		</Sidebar.Header>
	</Sidebar.Header>
	<Sidebar.Content class="gap-0">
		<Sidebar.Group>
			<Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				{#each data.main as { title, href, action, icon: Icon }}
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={$page.url.pathname === href}>
								{#snippet child({ props })}
									<a {href} {...props}>
										<Icon />
										<span>{title}</span>
									</a>
									{#if action}
										<Sidebar.MenuAction showOnHover>
											<a href={action}>
												<Plus class="size-4" />
											</a>
										</Sidebar.MenuAction>
									{/if}
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				{/each}
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	{#if user}
		<Sidebar.Footer>
			{@render footer(user)}
		</Sidebar.Footer>
	{/if}

	<Sidebar.Rail />
</Sidebar.Root>

{#snippet footer(user: User)}
	{@const src = getFallbackAvatar()}
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Sidebar.MenuButton
							size="lg"
							class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							{...props}
						>
							<Avatar.Root class="h-8 w-8 rounded-lg">
								<Avatar.Image src={name.src} alt="" />
								<Avatar.Fallback class="rounded-lg">BN</Avatar.Fallback>
							</Avatar.Root>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">{name.name}</span>
								<span class="truncate text-xs">{user.email}</span>
							</div>
							<ChevronsUpDown class="ml-auto size-4" />
						</Sidebar.MenuButton>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
					side={sidebar.isMobile ? 'bottom' : 'right'}
					align="end"
					sideOffset={4}
				>
					<DropdownMenu.Label class="p-0 font-normal">
						<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							<Avatar.Root class="h-8 w-8 rounded-lg">
								<Avatar.Image src={name.src} alt="" />
								<Avatar.Fallback class="rounded-lg">BN</Avatar.Fallback>
							</Avatar.Root>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">{name.name}</span>
								<span class="truncate text-xs">{user.email}</span>
							</div>
						</div>
					</DropdownMenu.Label>

					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item onclick={toggleMode} class="cursor-pointer" title="Toggle dark mode">
							{#if $mode === 'light'}
								<Moon />
								<span> Dark Mode </span>
							{:else}
								<Sun />
								<span> Light Mode </span>
							{/if}
						</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<form {...props} action="/logout" method="POST">
								<button type="submit" class="flex items-center gap-2 space-x-2 outline-none">
									<LogOut />
									Log out</button
								>
							</form>
						{/snippet}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
{/snippet}
