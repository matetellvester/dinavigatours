<script lang="ts" module>
	import {
		CalendarCheck2,
		ChevronsUpDown,
		LayoutDashboard,
		LayoutList,
		LogOut,
		MapPinHouse,
		Moon,
		Sun,
		Users,
		Ship
	} from 'lucide-svelte';
	const data = {
		versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
		navMain: [
			{
				title: 'Getting Started',
				url: '#',
				items: [
					{
						title: 'Dashboard',
						href: '/adm',
						icon: LayoutDashboard
					},
					{
						title: 'Users',
						href: '/adm/users',
						icon: Users
					},
					{
						title: 'Listing',
						href: '/adm/list',
						icon: LayoutList
					},
					{
						title: 'Attractions',
						href: '/adm/attractions',
						action: '/adm/attractions/add',
						icon: MapPinHouse
					},
					{
						title: 'Events',
						href: '/adm/events',
						action: '/adm/events/add',
						icon: CalendarCheck2
					},
					{
						title: 'Vessels',
						href: '/adm/vessels',
						icon: Ship
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { Plus, Settings } from 'lucide-svelte';
	import { mode, toggleMode } from 'mode-watcher';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	const sidebar = useSidebar();
</script>

<Sidebar.Root bind:ref {...restProps}>
	<Sidebar.Header>
		<div class="items flex pt-4">
			<img src="/favicon.png" alt="dinavigatour icon" class="size-10" />
			<h1 class="h-full px-2 font-poppins text-2xl font-extrabold">Dinavigatours</h1>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				{#each data.navMain[0].items as { title, href, action, icon: Icon }}
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								isActive={$page.url.pathname.split('/')[2] === href.split('/')[2]}
								class="data-[active=true]:text-primary dark:data-[active=true]:text-foreground"
							>
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
	<Sidebar.Footer>
		{@render footer()}
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>

{#snippet footer()}
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
								<Avatar.Image src="/adminuser.png" alt="adminuser" />
								<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
							</Avatar.Root>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">Admin</span>
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
								<Avatar.Image src="/adminuser.png" alt="adminuser" />
								<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
							</Avatar.Root>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">Admin</span>
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

						<DropdownMenu.Item class="cursor-pointer">
							{#snippet child({ props })}
								<a href="/adm/settings" {...props}>
									<Settings />
									Settings
								</a>
							{/snippet}
						</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<LogOut />
						Log out
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
{/snippet}
