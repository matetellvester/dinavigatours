<script lang="ts" module>
	import { House, Compass, CircleUser, MessageCircle } from 'lucide-svelte';
	// sample data
	const data = {
		versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1']
		// navMain: [
		// 	{
		// 		title: 'Getting Started',
		// 		url: '#',
		// 		items: [
		// 			{
		// 				title: 'Installation',
		// 				url: '#'
		// 			},
		// 			{
		// 				title: 'Project Structure',
		// 				url: '#'
		// 			}
		// 		]
		// 	}
		// ]

		// main: [
		// 	{
		// 		title: 'Dashboard',
		// 		href: '/'
		// 	},
		// 	{
		// 		title: 'Business',
		// 		href: '/b'
		// 	},
		// 	{
		// 		title: 'Admin',
		// 		href: '/a'
		// 	}
		// ]
	};

	const vaigations: { icon: any; href: string; label: string }[] = [
		{ icon: House, href: '/', label: 'Home' },
		{ icon: Compass, href: '/explore', label: 'Explore' },
		{ icon: MessageCircle, href: '/chats', label: 'Chats' },
		{ icon: CircleUser, href: '/account', label: 'Account' }
	];
</script>

<script lang="ts">
	import SearchForm from '$lib/components/search-form.svelte';
	import VersionSwitcher from '$lib/components/version-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/stores';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {...restProps}>
	<Sidebar.Header>
		<VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
	</Sidebar.Header>
	<Sidebar.Content class="gap-0">
		<!-- We create a Sidebar.Group for each parent. -->
		<!-- {#each data.navMain as group (group.title)}
			<Collapsible.Root title={group.title} open={true} class="group/collapsible">
				<Sidebar.Group>
					<Sidebar.GroupLabel
						class="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
					>
						{#snippet child({ props })}
							<Collapsible.Trigger {...props}>
								{group.title}
								<ChevronRight
									class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
								/>
							</Collapsible.Trigger>
						{/snippet}
					</Sidebar.GroupLabel>
					<Collapsible.Content>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								<div class="pl-3">
									{#each group.items as item (item.title)}
										<Sidebar.MenuItem>
											<Sidebar.MenuButton>
												{#snippet child({ props })}
													<a href={item.url} {...props}>{item.title}</a>
												{/snippet}
											</Sidebar.MenuButton>
										</Sidebar.MenuItem>
									{/each}
								</div>
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Collapsible.Content>
				</Sidebar.Group>
			</Collapsible.Root>
		{/each} -->

		<Sidebar.Menu class="px-3">
			{#each vaigations as { icon: Icon, label, href }}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton isActive={$page.url.pathname === href}>
						{#snippet child({ props })}
							<a {href} {...props}>
								<Icon />
								<span>{label}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.Content>
	<!-- <Sidebar.Rail /> -->
</Sidebar.Root>
