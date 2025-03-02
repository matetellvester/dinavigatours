<script lang="ts">
	import { Loader, ReceiptEuro } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import type { PageData } from './$types';
	import { bnsBookingColumns } from '$bns-comps/table/bns-columns';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import DataTableBooking from '$bns-comps/table/booking/data-table-booking.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import {
		approveDialogState,
		bookingList,
		checkInOutDialog,
		declineDialogState,
		declineDialogInfo as info,
		paymentDetailDialog,
		reasonDialog
	} from './index.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import { bnsHeader } from '../bns.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let isLoading = $state(false);
	let remarks = $state('');
	let full_payment = $state('');

	const setSatus = async (e: MouseEvent, btnAction: 'decline' | 'approved') => {
		// await sendNotif(btnAction);
		// return;
		e.preventDefault();

		if (!info.value.id) return;

		try {
			isLoading = true;
			const res = await fetch('/api/booking-info/' + info.value.id, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: btnAction, remarks: remarks.trim() || null })
			});

			if (!res.ok) return toast.error(`Unable to ${btnAction}, please try again...`);

			const resData = await res.json();

			if (!resData.success) return toast.error(`Action can't complete, please try again...`);

			await sendResponseNotif(btnAction);

			toast.success(`${btnAction.replace(/^./, (char) => char.toUpperCase())} successfully`);
			bookingList.setStatus(info.value.id, btnAction);

			if (remarks.trim()) {
				bookingList.setReason(info.value.id, remarks);
			}

			await tick();

			if (btnAction === 'decline') {
				declineDialogState.value = false;
			} else {
				approveDialogState.value = false;
			}

			await tick();
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
		}
	};

	const setCheckInOut = async (status: 'check-in' | 'complete') => {
		const id = checkInOutDialog.value.id;
		if (!id) {
			console.error(`Dili pwede maka set og ${status} kay walay id`);
			return;
		}

		try {
			isLoading = true;

			let body: { status: string; full_payment?: string } = { status };

			if (status === 'check-in') {
				body.full_payment = full_payment;
			}

			const res = await fetch('/api/booking-info/' + id, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				toast.error(
					`Unable to ${status === 'check-in' ? 'complete the check-in process' : 'finalize the checkout'}. Please try again!`
				);
				return;
			}

			if (status === 'check-in') {
				bookingList.setStatus(id, status, Number(full_payment));
			} else {
				bookingList.setStatus(id, status);
			}

			await sendStatusNotif(status);

			await tick();

			toast.success(`${status === 'check-in' ? 'Check-in' : 'Checkout'} completed successfully!`);
		} catch (error) {
			toast.error(
				`There is error while ${status === 'check-in' ? 'checking in' : 'checking out'}. Please try again!`
			);
		} finally {
			isLoading = false;
			checkInOutDialog.value.state = false;
		}
	};

	const formatDate = (date: Date): string => {
		const formatter = new Intl.DateTimeFormat('en-PH', {
			month: 'short',
			day: '2-digit',
			year: 'numeric'
		});
		return formatter.format(date);
	};

	const sendResponseNotif = async (btnAction: 'decline' | 'approved') => {
		let content = `Your tour for ${info.value.for} has been successfully confirmed. Scheduled on ${info.value.date}`;

		if (btnAction === 'decline') {
			content = `Your booking for ${info.value.for} on ${info.value.date} was declined`;
		}

		const { error } = await data.supabase.from('notification').insert([
			{
				user_id: info.value.user_id,
				title: btnAction === 'approved' ? 'Booking Confirmed' : 'Booking Decline',
				content
			}
		]);

		if (error) {
			console.error('Naay error sa pag insert og new notif');
		}
	};

	const sendStatusNotif = async (status: 'check-in' | 'complete') => {
		let content = `${checkInOutDialog.value.for} has been successfully checked-in on ${formatDate(new Date())}. We hope you enjoy your stay`;

		if (status === 'complete') {
			content = `${checkInOutDialog.value.for} has successfully checked-out on ${formatDate(new Date())}. Thank you for staying with us!`;
		}

		const { error } = await data.supabase.from('notification').insert([
			{
				user_id: checkInOutDialog.value.user_id,
				title: status === 'complete' ? 'Booking Complete' : 'Booking Checked-in',
				content
			}
		]);

		if (error) {
			console.error('Naay error sa pag insert og new notif');
		}
	};
	onMount(() => {
		bnsHeader.v = 'Booking';
		// @ts-ignore
		bookingList.value = data.bookingList;
	});
</script>

<svelte:head>
	<title>Booking</title>
</svelte:head>

<div class="p-4">
	<DataTableBooking data={bookingList.value} columns={bnsBookingColumns} />
</div>

<Dialog.Root bind:open={approveDialogState.value}>
	<Dialog.Content class="sm:max-w-[425px]">
		<form>
			<Dialog.Header>
				<Dialog.Title>Review and Respond Booking</Dialog.Title>
				<Dialog.Description>
					Selecting 'Approve' will finalize the booking, while 'Decline' will cancel it. These
					actions are irreversible.
				</Dialog.Description>
			</Dialog.Header>
			<div class="flex flex-col py-2">
				<div class="mb-4 text-sm font-semibold">
					<div>Client: <span class="text-muted-foreground">{info.value.client}</span></div>
					<div>Booking For: <span class="text-muted-foreground">{info.value.for}</span></div>
					<div>Contact No: <span class="text-muted-foreground">{info.value.no}</span></div>
					<div>Date: <span class="text-muted-foreground">{info.value.date}</span></div>
					<div>
						Down Payment:
						<span class="text-muted-foreground">
							{info.value.down || 'No down payment'}
						</span>
					</div>
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close
					type="button"
					disabled={isLoading}
					class={buttonVariants({ variant: 'outline', className: 'mr-auto' })}
				>
					Cancel
				</Dialog.Close>
				<Button
					type="button"
					disabled={isLoading}
					variant="destructive"
					onclick={async () => {
						approveDialogState.value = false;
						await tick();
						declineDialogState.value = true;
					}}
				>
					<span>Decline</span>
				</Button>
				<Button type="submit" disabled={isLoading} onclick={(e) => setSatus(e, 'approved')}>
					{#if isLoading}
						<Loader class="size-4 animate-spin" />
					{/if}
					<span>Approve</span>
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={reasonDialog.value.state}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				Reason for {reasonDialog.value.type === 'decline' ? 'Decline' : 'Canceled'}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{#if reasonDialog.value.reason?.trim()}
					{reasonDialog.value.reason}
				{:else}
					<i>
						No reason was provided for this
						{reasonDialog.value.type === 'decline' ? 'decline' : 'canceled'}.
					</i>
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action onclick={() => (reasonDialog.value.state = false)}>
				Close
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={declineDialogState.value}>
	<AlertDialog.Content>
		<form class="space-y-2">
			<AlertDialog.Header>
				<AlertDialog.Title>Decline Booking Request</AlertDialog.Title>
				<AlertDialog.Description>
					Are you sure you want to decline this booking request? This request will be marked as
					declined and cannot be undone.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<div>
				<Label for="declineReason" class="leading-6">Reason for Decline &lpar;Optional&rpar;</Label>
				<Textarea id="declineReason" name="reason" bind:value={remarks} />
			</div>
			<AlertDialog.Footer>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'outline', className: 'text-foreground' })}
					disabled={isLoading}
					onclick={async () => {
						declineDialogState.value = false;
						await tick();
						approveDialogState.value = true;
					}}>Close</AlertDialog.Action
				>
				<AlertDialog.Action
					type="submit"
					disabled={isLoading}
					onclick={(e) => setSatus(e, 'decline')}
					class={buttonVariants({ variant: 'destructive' })}
				>
					{#if isLoading}
						<Loader class="size-4 animate-spin" />
					{/if}
					<span>Confirm Decline</span>
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={checkInOutDialog.value.state}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{checkInOutDialog.value.status === 'check-in' ? 'Check-in' : 'Check-out'} Confirmation
			</AlertDialog.Title>
			<AlertDialog.Description>
				{#if checkInOutDialog.value.status === 'check-in'}
					Verify and log the customer's arrival for their booking.
				{:else}
					Finalize and record the customer's departure for their booking.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		{#if checkInOutDialog.value.status === 'check-in'}
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="checkDownPayment" class="text-right">Down Payment</Label>
					<Input
						min="1"
						disabled
						type="text"
						class="col-span-3"
						id="checkDownPayment"
						value={checkInOutDialog.value.down_payment || 'No Down Payment'}
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="fullPayment" class="text-right">Full payment</Label>
					<Input
						min="1"
						type="number"
						id="fullPayment"
						bind:value={full_payment}
						class="col-span-3"
					/>
				</div>
			</div>
		{/if}
		<AlertDialog.Footer>
			<AlertDialog.Action
				disabled={isLoading}
				class={buttonVariants({ variant: 'outline', className: 'text-foreground' })}
				onclick={() => (checkInOutDialog.value.state = false)}
			>
				Close
			</AlertDialog.Action>
			<AlertDialog.Action
				type="submit"
				disabled={isLoading || (checkInOutDialog.value.status === 'check-in' && !full_payment)}
				onclick={(e) => setCheckInOut(checkInOutDialog.value.status)}
			>
				{#if isLoading}
					<Loader class="size-4 animate-spin" />
				{/if}
				<span>
					Confirm {checkInOutDialog.value.status === 'check-in' ? 'Check-in' : 'Check-out'}
				</span>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={paymentDetailDialog.value.state}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Payment Summary</AlertDialog.Title>
			<AlertDialog.Description>
				Below are the payment details for this booking
			</AlertDialog.Description>
		</AlertDialog.Header>
		<div class="space-y-2">
			<div class="flex">
				<span class="text-muted-foreground">Down Payment:</span>
				<span class="ml-1 font-semibold">{paymentDetailDialog.value.down_payment}</span>
			</div>
			<div class="flex">
				<span class="text-muted-foreground">Full Payment:</span>
				<span class="ml-1 font-semibold">{paymentDetailDialog.value.full_payment}</span>
			</div>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Action onclick={() => (paymentDetailDialog.value.state = false)}>
				Close
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
