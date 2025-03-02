<script lang="ts">
	import { onMount } from 'svelte';
	import { bnsHeader } from './bns.svelte';
	import { Book, CircleHelp, DoorClosed, DoorOpen, HandHelping } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	// let { data } = $props();
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
			title: 'Total Service',
			query: () => getListing(),
			icon: HandHelping,
			details(counts: number) {
				if (counts > 0) {
					return `You added ${counts} services this month`;
				}
				return 'No new services were added this month';
			},
			className: 'border-yellow-600 bg-yellow-600/5',
			border: 'border-yellow-600'
		},
		{
			title: 'Total Check-out',
			query: () => getBooking('complete'),
			details(counts: number) {
				if (counts > 0) {
					return `${counts} checkouts completed this month`;
				}
				return 'No new checkouts completed this month';
			},
			icon: DoorOpen,
			className: 'border-blue-600 bg-blue-600/5',
			border: 'border-blue-600'
		},
		{
			title: 'Total Check-in',
			query: () => getBooking('check-in'),
			details(counts: number) {
				if (counts > 0) {
					return `${counts} successful check-ins this month`;
				}
				return 'No new check-ins completed this month';
			},
			icon: DoorClosed,
			className: 'border-red-600 bg-red-600/5',
			border: 'border-red-600'
		},
		{
			title: 'Total Pending',
			query: () => getBooking('pending'),
			icon: CircleHelp,
			details(counts: number) {
				if (counts > 0) {
					return `${counts} pending task`;
				}
				return 'No pending tasks';
			},
			className: 'border-fuchsia-600 bg-fuchsia-600/5',
			border: 'border-fuchsia-600'
		},
		{
			title: 'Total Loss booking',
			query: () => getBooking('canceled'),
			details(counts: number) {
				if (counts > 0) {
					return `${counts} bookings lost this month`;
				}
				return 'No new services were added this month';
			},
			icon: Book,
			className: 'border-green-600 bg-green-600/5',
			border: 'border-green-600'
		}
	];

	async function getBooking(status: BookingStatus) {
		const res = await fetch('/b?get=' + status);

		if (!res.ok) {
			console.error('Error sa pag kuha sa user na tourist', JSON.stringify(res, null, 2));
			return [0, `No ${status} book at this time`] as const;
		}

		const data = (await res.json()).data as { created_at: string }[];

		return [data.length, countCurrentMonthData(data)] as const;
	}

	async function getListing() {
		const res = await fetch('/b?get=getBooking');

		if (!res.ok) {
			console.error('Error sa pag kuha sa user na tourist', JSON.stringify(res, null, 2));
			return [0, 'No pending at this time'] as const;
		}

		const data = (await res.json()).data as { created_at: string }[];

		return [data.length, countCurrentMonthData(data)] as const;
	}

	function countCurrentMonthData(
		users: {
			created_at: string;
		}[]
	): number {
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
		bnsHeader.v = 'Dashboard';
	});
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
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
