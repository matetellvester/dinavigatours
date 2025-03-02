<script lang="ts">
	import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
	import { Button } from '$lib/components/ui/button';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { Book, ChevronRight, LogOut, Moon, User, UserRound } from 'lucide-svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	async function getUser(id: string): Promise<{ first_name: string; last_name: string }> {
		const res = await fetch('/api/userlist/' + id);

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const result = await res.json();

		if (result.success) {
			return result.data as { first_name: string; last_name: string };
		} else {
			throw new Error(result.error || 'Unknown error occurred');
		}
	}
</script>

<svelte:head>
	<title>Account</title>
</svelte:head>
<div class="flex h-full flex-col space-y-4 max-md:bg-muted-foreground/10">
	<!-- ROW 1 -->
	{#if data.user}
		<div class="flex flex-col rounded-b-3xl bg-background px-7 pb-6 pt-4">
			<h2 class="mb-6 mt-2 text-2xl font-semibold">Account</h2>
			<div class="flex">
				<div class="w-max rounded-full border bg-muted p-4">
					<UserRound class="size-10  text-muted-foreground " />
				</div>
				<div class="ml-4 flex flex-col">
					<div class="block py-2 font-bold">
						{#await getUser(data.user.id)}
							<div class="flex">
								<Skeleton class="h-6 w-12" />
								<Skeleton class="ml-2 h-6 w-16" />
							</div>
						{:then user}
							{user.first_name} {user.last_name}
						{/await}
					</div>
					<div class="block h-5 font-semibold leading-none text-muted-foreground">Tourist</div>
				</div>

				<div class="ml-auto flex h-full md:hidden">
					<form action="/logout" method="POST">
						<Button
							type="submit"
							variant="ghost"
							class="my-auto flex h-full flex-col [&_svg]:size-6"
						>
							<LogOut />
							<span class="text-xs">Logout</span>
						</Button>
					</form>
				</div>
			</div>
		</div>
	{:else}
		<div class="mt-2 w-full"></div>
	{/if}

	<div class="flex flex-col space-y-4 px-4 pb-4">
		<!-- ROW 1 -->
		<div
			class="flex flex-col justify-center divide-y rounded-2xl bg-background px-8 py-4 shadow-sm md:hidden"
		>
			<div class="flex items-center py-4">
				<Moon />
				<span class="ml-2">Dark Mode</span>
				<div class="ml-auto">
					<ThemeSwitcher />
				</div>
			</div>
		</div>

		<!-- ROW 2 -->
		<div
			class="flex flex-col justify-center space-y-2 divide-y rounded-2xl bg-background px-8 py-2 max-md:shadow-sm md:border"
		>
			<a href="/booking-list" class="flex items-center py-4">
				<Book />
				<span class="ml-2">Bookings</span>
				<ChevronRight class="ml-auto text-muted-foreground" />
			</a>

			<a href="/my-details" class="flex items-center py-4">
				<User />
				<span class="ml-2">My Details</span>
				<ChevronRight class="ml-auto text-muted-foreground" />
			</a>
		</div>

		<!-- ROW 3 -->
		<!-- <div
			class="flex flex-col justify-center divide-y rounded-2xl bg-background px-8 py-4 shadow-sm"
		>
			<div class="flex items-center py-4">
				<Settings />
				<span class="ml-2">Settings</span><ChevronRight class="ml-auto text-muted-foreground" />
			</div>
		</div> -->

		<!-- ROW 4 -->
		{#if !data.user}
			<div class="flex flex-1 flex-col md:hidden">
				<div
					class="mt-auto flex flex-col items-center justify-center rounded-2xl bg-muted px-8 pb-6 pt-8 shadow-sm ring-1"
				>
					<div class="text-2xl font-black">Login or Sign-up</div>
					<div class="flex items-center justify-center space-x-4 py-4">
						<Button variant="outline" href="/login">Login</Button>
						<Button href="/signup">Sign In</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
