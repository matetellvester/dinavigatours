<script lang="ts">
	import {
		approveDialogState,
		checkInOutDialog,
		declineDialogInfo,
		declineDialogState,
		paymentDetailDialog,
		reasonDialog
	} from '$bns-route/b/book/index.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import {
		CheckCheck,
		CircleHelp,
		CreditCard,
		DoorClosed,
		DoorOpen,
		Ellipsis
	} from 'lucide-svelte';

	interface Props {
		id: number;
		user_id: string;
		status: BookingStatus;
		first_name: string;
		last_name: string;
		name: string;
		checkin: string;
		checkout: string;
		contactNo: string;
		remarks: string;
		down_payment: number | null;
		full_payment: number | null;
	}

	const openResponseDialog = (approve = false) => {
		declineDialogInfo.value = {
			id,
			user_id,
			client: last_name + ', ' + first_name,
			for: name,
			no: contactNo,
			date: checkin + ' - ' + checkout,
			down: down_payment
		};

		if (!approve) {
			declineDialogState.value = true;
			return;
		}
		approveDialogState.value = true;
	};

	const setSatus = async (status: 'check-in' | 'complete') => {
		checkInOutDialog.value = { state: true, id, status, down_payment, user_id, for: name };
	};

	let {
		id,
		user_id,
		status,
		contactNo,
		first_name,
		last_name,
		name,
		checkin,
		checkout,
		remarks,
		down_payment,
		full_payment
	}: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end">
		<DropdownMenu.Group>
			{#if status === 'pending'}
				<DropdownMenu.GroupHeading>Action</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => openResponseDialog(true)}>
					<CheckCheck /> <span>Respond</span>
				</DropdownMenu.Item>
			{/if}

			{#if status === 'approved' || status === 'check-in'}
				<DropdownMenu.GroupHeading>Set Status</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => setSatus('check-in')} disabled={status === 'check-in'}>
					<DoorClosed /> <span>Check-in</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setSatus('complete')} disabled={status !== 'check-in'}>
					<DoorOpen /> <span>Check-out</span>
				</DropdownMenu.Item>
			{/if}

			{#if status === 'decline' || status === 'canceled'}
				<DropdownMenu.Item
					onclick={() => {
						reasonDialog.value = {
							state: true,
							type: status,
							reason: remarks
						};
					}}
				>
					<CircleHelp /> <span>See Reason</span>
				</DropdownMenu.Item>
			{/if}

			{#if status === 'complete'}
				<DropdownMenu.Item
					onclick={() => {
						paymentDetailDialog.value = { state: true, full_payment, down_payment };
					}}
				>
					<CreditCard /> <span>Payment Summary</span>
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
