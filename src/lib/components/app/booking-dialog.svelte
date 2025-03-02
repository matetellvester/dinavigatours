<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Loader } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';
	import Label from '../ui/label/label.svelte';

	interface Props {
		open: boolean;
		lstng_id: string | null;
	}

	interface BookingInfo {
		firstname: string;
		lastname: string;
		address: string;
		gender: string;
		dateOfBirth: string;
		nationality: string;
		email: string;
		contact_info: string;
		down_payment: number | null;
		checkIn: string;
		checkOut: string;
	}

	const today = new Date().toISOString().split('T')[0];

	let info: BookingInfo | null = $state(null);

	let minCheckOut = $state(today);

	const getMinDate = () => {
		const today = new Date();
		const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
		return maxDate.toISOString().split('T')[0];
	};

	$effect(() => {
		if (info?.checkIn.trim()) {
			// Create a Date object from the check-in date
			const checkInDate = new Date(info.checkIn);

			// Add one day
			checkInDate.setDate(checkInDate.getDate() + 1);

			// Convert back to YYYY-MM-DD format
			minCheckOut = checkInDate.toISOString().split('T')[0];
		} else {
			minCheckOut = today;
		}
	});

	let lastInfo: BookingInfo | null = $state(null);

	let { open = $bindable(false), lstng_id }: Props = $props();

	let isLoading = $state(false);

	async function submitBooking(e: Event) {
		e.preventDefault();

		if (!info) return;
		try {
			isLoading = true;
			const response = await fetch('/api/booking-info', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userName: info.firstname + ' ' + info.lastname,
					booking_date: info.checkIn,
					lstng_id,
					checkin: info.checkIn,
					checkout: info.checkOut,
					down_payment: info.down_payment
				})
			});

			const result = (await response.json()) as {
				status: 'error' | 'success';
				message: string;
			};

			if (result.status === 'error') {
				toast.error("Can't complete booking");
			} else {
				if (!(await updateUserInfo())) {
					toast.error("Can't complete booking");
					throw new Error('Naay error sa pag update sa user info');
				}

				const url = new URL(window.location.href);
				url.searchParams.delete('book'); // Remove the 'book' query parameter
				goto(`${url.pathname}?${url.searchParams.toString()}`, { replaceState: true });

				await tick();
				toast.success('Booked Successfully');
			}
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
		}
	}

	async function updateUserInfo(): Promise<boolean> {
		if (!info || !lastInfo) return false;

		const newData = filterAndReplaceEmptyValues(lastInfo, info);

		try {
			const response = await fetch('/api/current-user', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newData)
			});
			return response.ok;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	/**
	 *
	 * @param source Ang object that has empty value
	 * @param replacement Object that has values
	 */
	function filterAndReplaceEmptyValues(source: BookingInfo, replacement: BookingInfo) {
		const newArr = Object.entries(source)
			.filter(([, value]) => value === '' || value === null)
			.reduce((acc, [key]) => {
				(acc as any)[key as keyof BookingInfo] = replacement[key as keyof BookingInfo] as
					| string
					| number
					| undefined;
				return acc;
			}, {} as Partial<BookingInfo>);

		delete newArr.checkIn;
		delete newArr.checkOut;

		newArr.contact_info = replacement.contact_info;

		return newArr;
	}

	onMount(async () => {
		try {
			const res = await fetch('/api/current-user');

			if (!res.ok) {
				throw new Error(await res.text());
			}

			const data = (await res.json()) as {
				success: boolean;
				data: {
					id: string;
					role: number;
					first_name: string;
					last_name: string;
					contact_info: string;
					address: string;
					gender: string;
					dateOfBirth: string;
					nationality: string;
					down_payment: number | null;
					email: string;
				};
			};

			if (!data.success || !data.data) {
				info = {
					firstname: '',
					lastname: '',
					address: '',
					gender: '',
					dateOfBirth: '',
					nationality: '',
					email: '',
					contact_info: '',
					down_payment: null,
					checkIn: '',
					checkOut: ''
				};
			} else {
				const u = data.data;
				info = {
					firstname: u.first_name,
					lastname: u.last_name,
					address: u.address || '',
					gender: u.gender || '',
					dateOfBirth: u.dateOfBirth || '',
					nationality: u.nationality || 'Filipino',
					email: u.email,
					contact_info: u.contact_info?.trim() || '',
					down_payment: u.down_payment,
					checkIn: '',
					checkOut: ''
				};

				await tick();

				lastInfo = {
					firstname: u.first_name,
					lastname: u.last_name,
					address: u.address || '',
					gender: u.gender || '',
					dateOfBirth: u.dateOfBirth || '',
					nationality: u.nationality || '',
					email: u.email,
					contact_info: u.contact_info?.trim() || '',
					down_payment: null,
					checkIn: '',
					checkOut: ''
				};
			}
		} catch (error) {
			throw new Error(error as string);
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		closeBtnOnClick={async () => {
			const url = new URL(window.location.href);
			url.searchParams.delete('book');
			goto(`${url.pathname}?${url.searchParams.toString()}`, { replaceState: true });
		}}
		class="max-sm:h-full"
	>
		{#if !info}
			{@render contentLoading()}
		{:else}
			{@render contentLoaded()}
		{/if}
	</Dialog.Content>
</Dialog.Root>

{#snippet contentLoading()}
	<div class="mt-6 flex h-40 space-y-2">
		<div class="m-auto flex items-center space-x-2">
			<Loader class=" size-4 animate-spin" />
			<span>Please wait...</span>
		</div>
	</div>
{/snippet}

{#snippet contentLoaded()}
	{#if info && lastInfo}
		<form onsubmit={submitBooking} autocomplete="off" class="max-sm:overflow-auto max-sm:px-1">
			<Dialog.Header class="text-left">
				<Dialog.Title>Confirm Your Booking</Dialog.Title>
				<Dialog.Description>
					Please provide your details to complete the booking. Review your information carefully
					before confirming.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<!-- First name and Last name -->
				<div class="flex max-sm:flex-col max-sm:space-y-2 sm:space-x-2">
					<!-- FIRSTNAME -->
					<div class="flex flex-1 flex-col">
						<Label for="firstname" class="leading-6">First Name</Label>

						<div class="relative w-full">
							<Input disabled autocomplete="off" id="firstname" bind:value={info.firstname} />
						</div>
					</div>

					<!-- LASTNAME -->
					<div class="flex flex-1 flex-col">
						<Label for="lastname" class="leading-6">Last Name</Label>

						<div class="relative w-full">
							<Input disabled autocomplete="off" id="lastname" bind:value={info.lastname} />
						</div>
					</div>
				</div>

				<!-- Email and Contact -->
				<div class="flex max-sm:flex-col max-sm:space-y-2 sm:space-x-2">
					<!-- Email -->
					<div class="flex flex-1 flex-col">
						<Label for="email" class="leading-6">Email</Label>

						<div class="relative col-span-3 w-full">
							<Input autocomplete="off" id="email" disabled bind:value={info.email} />
						</div>
					</div>

					<!-- CONTACT INFO -->
					<div class="flex flex-1 flex-col">
						<Label for="contactInfo" class="leading-6">Contact Info</Label>

						<div class="relative col-span-3 w-full">
							<Input required autocomplete="off" id="contactInfo" bind:value={info.contact_info} />
						</div>
					</div>
				</div>

				<!-- Gender and Nationality -->
				<div class="flex max-sm:flex-col max-sm:space-y-2 sm:space-x-2">
					<!-- Gender -->
					<div class="flex flex-1 flex-col">
						<Label for="gender" class="leading-6">Gender</Label>

						<Select.Root type="single" name="gender" bind:value={info.gender}>
							<Select.Trigger
								disabled={lastInfo.gender.trim() !== ''}
								id="gender"
								class="w-full capitalize"
							>
								{info.gender || 'Select gender'}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Item value="male" label="male">Male</Select.Item>
									<Select.Item value="female" label="female">Female</Select.Item>
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>

					<!-- CONTACT INFO -->
					<div class="flex flex-1 flex-col">
						<Label for="nationality" class="leading-6">Nationality</Label>

						<div class="relative col-span-3 w-full">
							<Input required autocomplete="off" id="nationality" bind:value={info.nationality} />
						</div>
					</div>
				</div>

				<!-- Date of birth and Addrress -->
				<div class="flex max-sm:flex-col max-sm:space-y-2 sm:space-x-2">
					<div class="flex flex-1 flex-col">
						<Label for="dateOfBirth" class="leading-6">Date of birth</Label>
						<Input
							class=" block"
							required
							type="date"
							id="dateOfBirth"
							max={getMinDate()}
							bind:value={info.dateOfBirth}
						/>
					</div>
					<div class="flex flex-1 flex-col">
						<Label for="address" class="leading-6">Address</Label>
						<Input required id="address" bind:value={info.address} type="text" class="block" />
					</div>
				</div>

				<!-- Checkin And Checkout -->
				<div class="flex max-sm:flex-col max-sm:space-y-2 sm:space-x-2">
					<div class="flex flex-1 flex-col">
						<Label for="bookDate" class="leading-6">Check-In Date</Label>
						<Input
							required
							id="bookDate"
							type="date"
							min={today}
							bind:value={info.checkIn}
							class="block"
						/>
					</div>
					<div class="flex flex-1 flex-col">
						<Label for="checkout" class="leading-6">Check-Out Date</Label>
						<Input
							required
							id="checkout"
							min={minCheckOut}
							bind:value={info.checkOut}
							type="date"
							class="block"
						/>
					</div>
				</div>

				<!-- Downpayment -->
				<div class="flex max-sm:flex-col max-sm:space-y-2 sm:space-x-2">
					<div class="flex flex-1 flex-col">
						<Label for="downpayment" class="leading-6">Down Payment</Label>
						<Input
							required
							id="downpayment"
							bind:value={info.down_payment}
							type="number"
							min="1"
							class="block"
						/>
					</div>
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit" disabled={isLoading}>
					{#if isLoading}
						<Loader class="size-4 animate-spin" />
					{/if}
					Confirm Booking
				</Button>
			</Dialog.Footer>
		</form>
	{/if}
{/snippet}
