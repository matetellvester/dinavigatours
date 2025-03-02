<script lang="ts">
	import RatingDialog from '$lib/components/rating-dialog.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { isDesktop } from '$lib/hooks/is-mobile.svelte';
	import { cn, getThumbnail, statusClass, formatDate } from '$lib/utils';
	import { format, parseISO } from 'date-fns';
	import { BookX, DoorClosed, DoorOpen, Loader } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	type BookingDetail = {
		id: number;
		created_at: string;
		booking_date: string;
		checkin: string;
		checkout: string;
		status: BookingStatus;
		lstng_id: number;
		remarks: string | null;
		info: {
			name: string;
			branch: string;
			category: string;
		};
		ratings: null | number;
	};

	type BookingsList = {
		books: BookingDetail[];
		updateCancel: (id: number, remarks: string) => void;
		updateRating: (id: number, rating: number | null) => void;
	};

	let bookings = $state<BookingsList>({
		books: [],
		updateCancel(id, remarks) {
			this.books = this.books.map((b) => (b.id === id ? { ...b, remarks, status: 'canceled' } : b));
		},
		updateRating(id, rating) {
			this.books = this.books.map((b) => (b.id === id ? { ...b, ratings: rating } : b));
		}
	});

	let { data }: Props = $props();

	let isLoading = $state(false);
	let cancelState = $state<{
		s: boolean;
		id: number | null;
		bookingName: string;
		bookingDate: string;
	}>({
		s: false,
		id: null,
		bookingName: '',
		bookingDate: ''
	});

	let remarks = $state('');
	let ratingDialog = $state<{
		s: boolean;
		d: { lstng_id: number | null; booking_id: number | null };
	}>({
		s: false,
		d: { lstng_id: null, booking_id: null }
	});

	let reasonState = $state({
		s: false,
		r: '',
		t: ''
	});

	async function getMedia(id: any) {
		const res = await fetch(`/api/ltsng-basic-info/${id}/ltsng-media`);

		if (!res.ok) {
			throw new Error(await res.text());
		}
		const result = await res.json();

		if (result.success) {
			return result.data as Omit<Media, 'description' | 'copyright_link'>[];
		} else {
			throw new Error(result.error || 'Unknown error occurred');
		}
	}

	async function cancelBookiong() {
		if (!cancelState.id) {
			console.error('Walay id sa cancel state, please check');
			return;
		}

		const position = isDesktop.current ? 'bottom-right' : 'top-right';

		try {
			isLoading = true;
			const res = await fetch('/api/booking-info/' + cancelState.id, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'canceled', remarks: remarks.trim() || null })
			});

			if (!res.ok) {
				return toast.error(`Unable to cancel your booking! Please try again...`, { position });
			}

			await sendCanceNotif();

			bookings.updateCancel(cancelState.id, remarks);

			toast.success('Canceled Successfully', { position });

			cancelState.s = false;
			cancelState.id = null;

			await tick();
		} catch (error) {
			toast.error(`There was an error while canceling your booking! Please try again...`, {
				position
			});
		} finally {
			isLoading = false;
		}
	}

	async function sendCanceNotif() {
		const { data: listngUser, error: err1 } = await data.supabase
			.from('ltsng_basic_info')
			.select('user_id')
			.eq('id', cancelState.id)
			.single();

		if (err1) {
			console.error(
				'Naay error sa pag kuha sa operator id while about to send notif: ',
				JSON.stringify(err1, null, 2)
			);
			return;
		}

		const user_id = listngUser.user_id;

		let content = `${data.currUser}'s booking at "${cancelState.bookingName}" for ${formatDate(cancelState.bookingDate)}, has been cancelled`;

		const { error } = await data.supabase.from('notification').insert([
			{
				user_id,
				title: 'Booking Cancellation Notice',
				content
			}
		]);

		if (error) {
			console.error('Naay error sa pag create og new notif: ', JSON.stringify(error, null, 2));
		}
	}

	onMount(() => {
		bookings.books = data.bookingList;
	});
</script>

<div class="mx-auto p-4 max-md:space-y-4 md:divide-y">
	{#each bookings.books as booking}
		{@render book(booking)}
	{/each}
</div>

{#snippet book(b: BookingDetail)}
	<div
		class="flex grid-cols-2 flex-col rounded-2xl bg-background p-4 shadow-sm md:grid md:rounded-none md:shadow-none"
	>
		<div class="flex">
			<!-- {@const img = getThumbnail(getMedia(b.lstng_id))} -->
			<div
				class="relative aspect-square w-28 rounded-lg bg-muted bg-[url('./fallback_broken_image_link.png')] bg-cover bg-center shadow-sm md:w-60 md:rounded-2xl"
			>
				{#await getMedia(b.lstng_id) then srcs}
					<img
						src={getThumbnail(srcs)}
						class="absolute inset-0 h-full w-full rounded-lg object-cover md:rounded-2xl"
						alt=""
					/>
				{/await}
			</div>

			<div class="ml-4 w-full">
				<div class="font-poppins font-semibold md:text-lg">{b.info.name}</div>
				{@render date(b.checkin, b.checkout, b.status)}
			</div>
		</div>
		{@render status(b.id, b.lstng_id, b.status, b.remarks, b.ratings, b.booking_date, b.info.name)}
	</div>
{/snippet}

{#snippet date(checkin: string, checkout: string, status: BookingStatus)}
	<div class="md:text-md w-full rounded-lg py-2 text-sm text-muted-foreground">
		<div class="flex items-center">
			<DoorClosed class="size-4" />
			<div>{format(parseISO(checkin), 'MMM dd, yyyy')}</div>
		</div>
		<div class="flex items-center">
			<DoorOpen class="size-4" />
			<div>{format(parseISO(checkout), 'MMM dd, yyyy')}</div>
		</div>

		<Badge class={cn(statusClass[status], 'mt-4 h-max max-md:hidden')}>{status}</Badge>
	</div>
{/snippet}

{#snippet status(
	id: any,
	lstng_id: number,
	status: BookingStatus,
	remarks: string | null,
	ratings: null | number,
	bookingDate: string,
	bookingName: string
)}
	<div class="mt-3 flex items-center border-t-2 border-dashed pt-3 md:border-none">
		<Badge class={cn(statusClass[status], 'h-max md:hidden')}>{status}</Badge>

		{#if status === 'pending'}
			<Button
				size="sm"
				variant="outline"
				onclick={() => {
					cancelState.s = true;
					cancelState.id = id;
					cancelState = {
						s: true,
						id,
						bookingDate,
						bookingName
					};
				}}
				class="ml-auto text-destructive ring-destructive hover:bg-destructive/5 hover:text-destructive"
			>
				<BookX />
				<span>Cancel Booking </span>
			</Button>
		{/if}

		{#if status === 'decline' || status === 'canceled'}
			<Button
				size="sm"
				variant="outline"
				class="ml-auto"
				onclick={() =>
					(reasonState = {
						s: true,
						r: remarks || '',
						t: status
					})}
			>
				See Reason
			</Button>
		{/if}

		{#if status === 'complete'}
			<Button
				size="sm"
				class="ml-auto"
				disabled={!!ratings}
				onclick={() => {
					ratingDialog = {
						s: true,
						d: { lstng_id, booking_id: id }
					};
				}}>Rate</Button
			>
		{/if}
		<!-- <Button size="sm" class="ml-auto">Rate</Button> -->
	</div>
{/snippet}

<RatingDialog
	bind:open={ratingDialog.s}
	data={ratingDialog.d}
	onDone={(id, rating) => bookings.updateRating(id, rating)}
/>

{#if isDesktop.current}
	<!-- Reason Dialog -->
	<AlertDialog.Root bind:open={reasonState.s}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>
					{reasonState.t === 'decline' ? 'Decline' : 'Cancel'} Reason
				</AlertDialog.Title>
				<AlertDialog.Description>
					{#if reasonState.r?.trim()}
						{reasonState.r}
					{:else}
						<i>
							No reason was provided for this
							{reasonState.t === 'decline' ? 'declined' : 'canceled'}
						</i>
					{/if}
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Close</AlertDialog.Cancel>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<!-- Cancel Dialog -->
	<Dialog.Root bind:open={cancelState.s}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Cancel Booking Confirmation</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to cancel this booking? This action cannot be undone. Please provide
					your reason.
				</Dialog.Description>
			</Dialog.Header>
			<div class="">
				<Label for="reasonDialog" class="leading-8">Your Reason &lpar;Optional&rpar;</Label>
				<Textarea
					id="reasonDialog"
					bind:value={remarks}
					placeholder="Please briefly explain why you're canceling."
				/>
			</div>
			<Dialog.Footer>
				<Dialog.Close
					type="button"
					disabled={isLoading}
					class={buttonVariants({ variant: 'outline' })}
				>
					Cancel
				</Dialog.Close>
				<Button type="submit" variant="destructive" onclick={cancelBookiong} disabled={isLoading}>
					{#if isLoading}
						<Loader class="animate-spin" />
					{/if}
					<span>Confirm Cancelation</span>
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<!-- Reason Drawer -->
	<Drawer.Root bind:open={reasonState.s}>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>
					{reasonState.t === 'decline' ? 'Decline' : 'Cancel'} Reason
				</Drawer.Title>
				<Drawer.Description>
					{#if reasonState.r?.trim()}
						{reasonState.r}
					{:else}
						<i>
							No reason was provided for this
							{reasonState.t === 'decline' ? 'declined' : 'canceled'}
						</i>
					{/if}
				</Drawer.Description>
			</Drawer.Header>
			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Close</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>

	<!-- Cancel Drawer -->
	<Drawer.Root bind:open={cancelState.s}>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Cancel Booking Confirmation</Drawer.Title>
				<Drawer.Description>
					Are you sure you want to cancel this booking? This action cannot be undone. Please provide
					your reason.
				</Drawer.Description>
			</Drawer.Header>
			<div class="px-4 pb-4">
				<Label for="reasonDrawer" class="leading-8">Your Reason &lpar;Optional&rpar;</Label>
				<Textarea
					id="reasonDrawer"
					bind:value={remarks}
					placeholder="Please briefly explain why you're canceling."
				/>
			</div>
			<Drawer.Footer class="flex flex-row pt-2">
				<Drawer.Close
					disabled={isLoading}
					class={buttonVariants({ variant: 'outline', className: 'w-full' })}
				>
					Cancel
				</Drawer.Close>
				<Button
					type="submit"
					class="w-full"
					variant="destructive"
					disabled={isLoading}
					onclick={cancelBookiong}
				>
					{#if isLoading}
						<Loader class="animate-spin" />
					{/if}
					<span>Confirm Cancelation</span>
				</Button>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
