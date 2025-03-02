<script lang="ts">
	import { admHeader } from '$adm-route/admin.svelte.js';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { cn } from '$lib/utils.js';
	import { Binoculars, Book, Calendar, HandHelping, Store, Users, UsersRound } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	type Card = {
		title: string;
		query: () => Promise<readonly [any, any]>;
		details: (counts?: any) => string;
		className: string;
		border: string;
		icon: any;
	};

	const cards: Card[] = [
		{
			title: 'Total Tourists',
			query: () => getAllTouristUser('getAllTouristUser'),
			icon: UsersRound,
			details(counts: number) {
				if (counts > 0) {
					return `${counts} tourists signed up this month`;
				}
				return 'No tourists registered this month';
			},
			className: 'border-fuchsia-600 bg-fuchsia-600/5',
			border: 'border-fuchsia-600'
		},
		{
			title: 'Total Agencies',
			query: () => getAllTouristUser('getAllAgencies'),
			details(counts: number) {
				if (counts > 0) {
					return `${counts} new agencies joined this month`;
				}
				return 'No new agencies onboarded this month';
			},
			icon: Store,
			className: 'border-green-600 bg-green-600/5 ',
			border: 'border-green-600'
		},
		{
			title: 'Total Service',
			query: () => getAllListing('getAllListing'),
			details(counts: number) {
				if (counts > 0) {
					return `${counts} new services added this month`;
				}
				return 'No new services were added this month';
			},
			icon: HandHelping,
			className: 'border-yellow-600 bg-yellow-600/5',
			border: 'border-yellow-600'
		},
		{
			title: 'Total Attractions',
			query: () => getAllListing('getAllAttractions'),
			details(counts: number) {
				if (counts > 0) {
					return `${counts} new attractions added this month`;
				}
				return `No new attractions added this month`;
			},
			icon: Binoculars,
			className: 'border-blue-600 bg-blue-600/5',
			border: 'border-blue-600'
		},
		{
			title: 'Total Events',
			query: () => getAllEvents(),
			details(counts: number) {
				if (counts > 0) {
					return `${counts} new events listed this month`;
				}
				return `No new events added this month`;
			},
			icon: Calendar,
			className: 'border-red-600 bg-red-600/5',
			border: 'border-red-600'
		},
		{
			title: 'Total Booked',
			query: () => getAllBooked(),
			details(counts) {
				if (counts > 0) {
					return `${counts} pending booking`;
				}
				return `No new bookings made this month`;
			},
			icon: Book,
			className: 'border-purple-600 bg-purple-600/5 ',
			border: 'border-purple-600'
		}
	];

	// TYPES
	type CountsObj = {
		created_at: string;
	};

	// FETCHERS
	async function getAllTouristUser(role: 'getAllTouristUser' | 'getAllAgencies') {
		const res = await fetch('/adm?get=' + role);

		if (!res.ok) {
			console.error('Err0r sa pag kuha sa user na tourist', JSON.stringify(res, null, 2));
			return [0, 0] as const;
		}

		const data = (await res.json()).data as CountsObj[];

		return [data.length, countCurrentMonthData(data)] as const;
	}

	async function getAllListing(role: 'getAllListing' | 'getAllAttractions') {
		const res = await fetch('/adm?get=' + role);

		if (!res.ok) {
			console.error('Err0r sa pag kuha sa user na tourist', JSON.stringify(res, null, 2));
			return [0, 0] as const;
		}

		const data = (await res.json()).data as CountsObj[];

		return [data.length, countCurrentMonthData(data)] as const;
	}

	async function getAllEvents() {
		const res = await fetch('/adm?get=getAllEvents');

		if (!res.ok) {
			console.error('Error sa pag kuha sa user na tourist', JSON.stringify(res, null, 2));
			return [0, 0] as const;
		}

		const data = (await res.json()).data as CountsObj[];

		return [data.length, countCurrentMonthData(data)] as const;
	}

	async function getAllBooked() {
		const res = await fetch('/adm?get=getAllBooked');

		if (!res.ok) {
			console.error('Error sa pag kuha sa user na tourist', JSON.stringify(res, null, 2));
			return [0, 0] as const;
		}

		const data = (await res.json()).data as { created_at: string; status: BookingStatus }[];

		const counts = data.filter((item) => item.status === 'pending').length;

		return [data.length, counts] as const;
	}

	// HELPERS
	function countCurrentMonthData(users: CountsObj[]): number {
		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth(); // 0-based (January = 0)

		const count = users.filter((user) => {
			const createdAt = new Date(user.created_at);
			return createdAt.getFullYear() === currentYear && createdAt.getMonth() === currentMonth;
		}).length;

		return count;
	}

	onMount(async () => {
		admHeader.v = 'Dashboard';
	});
</script>

<svelte:head>
	<title>Dashboard | Admin</title>
</svelte:head>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
	{#each cards as t}
		{@const Icon = t.icon}

		<div class={cn(t.className, 'rounded-xl border  text-card-foreground shadow')}>
			<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
				<div role="heading" aria-level="3" class="text-sm font-medium tracking-tight">
					{t.title}
				</div>
				<Icon class="float-right ml-auto size-4 text-muted-foreground" />
			</div>
			<div class="px-6 pb-6">
				{#await t.query()}
					<Skeleton class={cn(t.border, 'mt-2 h-5 w-8 border')} />
					<Skeleton class={cn(t.border, 'mt-2 h-3 w-20 border')} />
				{:then d}
					<div class="text-2xl font-bold">{d[0]}</div>
					<p class="text-xs text-muted-foreground">{t.details(d[1])}</p>
				{/await}
			</div>
		</div>
	{/each}
</div>
