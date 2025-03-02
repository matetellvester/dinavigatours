<script lang="ts">
	import MediaAdder from '$adm-route/adm/attractions/add/media-adder.svelte';
	import { admHeader } from '$adm-route/admin.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import StepLocation from '$bns-comps/stepper/step-location.svelte';
	import DayRange from '$lib/components/calendar/day-range.svelte';
	import DaySelect from '$lib/components/calendar/day-select.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { makeNameAttribute } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { ArrowLeft, ArrowRight, Calendar, Clock3, Loader, MapPin } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';

	import MonthRange from '$lib/components/calendar/month-range.svelte';

	let includeTime = $state(false);
	let currentStep = $state('basicInfo');
	let isLoading = $state(false);
	// let isAllDay = $state(false);
	let nameVal = $state('');
	let despVal = $state('');

	//#region popover states
	let openMonth = $state(false);
	let openDay = $state(false);
	let openDayRange = $state(false);
	//#endregion

	//#region time
	let selectedStartTime = $state('');
	let selectedEndTime = $state('');
	let timeType: 'default' | 'whole_day' | '24_Hour' = $state('default');
	//#endregion

	//#region year day
	let selectedStartDay: number | null = $state(null);
	let selectedEndDay: number | null = $state(null);
	//#endregion

	//#region month range
	let selectedStartMonth: string | null = $state(null);
	let selectedEndMonth: string | null = $state(null);
	//#endregion

	let selectedMonth = $state('');
	let selectedDay: number | null = $state(null);
	let selectedType: 'one_time' | 'yearly' | 'monthly' = $state('one_time');
	let selectedStartDate = $state('');
	let selectedEndDate = $state('');
	let startVal: number | null = $state(null);
	let endVal: number | null = $state(null);

	let previewUrls: {
		src: string;
		name: string;
		copyright: string;
		desp: string;
		path: string;
		file: File;
		isThumbnail: boolean;
		type: 'image' | 'video';
	}[] = $state([]);

	const tomorrow = () => {
		const date = new Date();
		date.setDate(date.getDate() + 1);
		return date.toISOString().split('T')[0];
	};

	let minOneTimeDate = $derived.by(() => {
		if (!selectedStartDate) {
			const date = new Date();
			date.setDate(date.getDate() + 2);
			return date.toISOString().split('T')[0];
		}

		const minDate = new Date(selectedStartDate);

		minDate.setDate(minDate.getDate() + 1);

		return minDate.toISOString().split('T')[0];
	});

	let maxEndDate = $derived.by(() => {
		if (selectedStartDate && selectedType === 'monthly') {
			const minDate = new Date(selectedStartDate);
			const lastDayOfMonth = new Date(minDate.getFullYear(), minDate.getMonth() + 1, 0);
			return lastDayOfMonth.toISOString().split('T')[0];
		}

		return '';
	});

	const handleSubmit: SubmitFunction = ({ formData }) => {
		isLoading = true;

		const [name] = makeNameAttribute('media', { mode: 'objectsInArray' });

		const appenders = {
			one_time: appendOneTimeEvent,
			yearly: appendYearlyEvent,
			monthly: appendMonthEvent
		};

		formData.append(`data[name]`, nameVal);
		formData.append(`data[description]`, despVal);
		formData.append(`data[type]`, selectedType);

		appendTime(formData);

		appenders[selectedType](formData);

		previewUrls.forEach((media, i) => {
			if (media.file instanceof File) {
				formData.append(name('file', i), media.file);
				formData.append(name('type', i), media.type);
				formData.append(name('desp', i), media.desp);
				formData.append(name('copyright', i), media.copyright);
				formData.append(name('isThumbnail', i), String(media.isThumbnail));
			} else {
				console.error('Invalid file object:', media.file);
			}
		});

		return async ({ result, update }) => {
			//@ts-ignore
			if (result.success) {
				await update({ reset: false });

				toast.success('Added Successfully');
				await goto('/adm/events');
			}
			isLoading = false;
		};
	};

	function appendTime(formData: FormData) {
		if (!includeTime) return;
		formData.append(`data[time_type]`, timeType);

		if (timeType !== '24_Hour') {
			formData.append(`data[end_time]`, selectedEndTime);
		}

		formData.append(`data[start_time]`, selectedStartTime);
	}

	function appendOneTimeEvent(formData: FormData) {
		formData.append(`data[start_datetime]`, selectedStartDate);
		formData.append(`data[end_datetime]`, selectedEndDate);
	}

	function appendYearlyEvent(formData: FormData) {
		if (!selectedStartMonth || !startVal) {
			console.warn('Some values are null or undefined', selectedStartMonth, ', ', selectedStartDay);
			return;
		}

		if (selectedEndMonth) {
			formData.append(`data[month]`, selectedStartMonth + '-' + selectedEndMonth);
			formData.append(`data[day_range]`, String(selectedStartDay) + '-' + String(selectedEndDay));
			return;
		}

		formData.append(`data[month]`, selectedStartMonth);

		if (startVal && endVal) {
			formData.append(`data[day_range]`, String(startVal) + '-' + endVal);
			return;
		}

		formData.append(`data[day_range]`, String(startVal));
	}

	function appendMonthEvent(formData: FormData) {
		if (!startVal) {
			console.warn('Ang selected day range is: ', startVal);
			return;
		}

		formData.append(`data[month]`, selectedMonth);

		if (endVal) {
			formData.append(`data[day_range]`, `${startVal}-${endVal}`);
			return;
		}

		formData.append(`data[day_range]`, `${startVal}`);
	}

	function formatTimeWithAMPM(time: string): string {
		const [hours, minutes] = time.split(':').map(Number);
		const date = new Date();
		date.setHours(hours);
		date.setMinutes(minutes);

		return new Intl.DateTimeFormat('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		}).format(date);
	}

	function convertTo12HourFormat(startTime: string): string {
		const [hours, minutes] = startTime.split(':').map(Number);

		// Create a Date object to handle the time manipulation
		const date = new Date();
		date.setHours(hours);
		date.setMinutes(minutes);

		// Add 12 hours to the start time
		date.setHours(date.getHours() + 12);
		date.setMinutes(date.getMinutes() - 1);

		// Return the result as a string in 24-hour format (HH:mm)
		const endHours = String(date.getHours()).padStart(2, '0');
		const endMinutes = String(date.getMinutes()).padStart(2, '0');

		return `${endHours}:${endMinutes}`;
	}

	const eventType = [
		{ value: 'one_time', label: 'One time event' },
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'yearly', label: 'Yearly' }
	];

	const months = [
		{ name: 'Jan', value: '01' },
		{ name: 'Feb', value: '02' },
		{ name: 'Mar', value: '03' },
		{ name: 'Apr', value: '04' },
		{ name: 'May', value: '05' },
		{ name: 'Jun', value: '06' },
		{ name: 'Jul', value: '07' },
		{ name: 'Aug', value: '08' },
		{ name: 'Sep', value: '09' },
		{ name: 'Oct', value: '10' },
		{ name: 'Nov', value: '11' },
		{ name: 'Dec', value: '12' }
	];

	const triggerContent = $derived(
		eventType.find((f) => f.value === selectedType)?.label ?? 'Select event type'
	);

	$effect(() => {
		if (selectedType !== 'yearly') {
			selectedStartDate = '';
			selectedEndDate = '';
		}
	});

	$effect(() => {
		if (timeType === 'whole_day') {
			if (selectedStartTime) {
				selectedEndTime = convertTo12HourFormat(selectedStartTime);
				return;
			}

			selectedStartTime = '00:00';
		}
	});

	onMount(() => {
		admHeader.v = 'Add New Event';
	});
</script>

<svelte:head>
	<title>Add Event | Admin</title>
</svelte:head>

<div class="px-8">
	<Tabs.Root bind:value={currentStep} class="mx-auto max-w-5xl">
		<Tabs.List class="mt-4 grid w-full grid-cols-2">
			<Tabs.Trigger value="basicInfo">Basic Information</Tabs.Trigger>
			<Tabs.Trigger value="media">Media</Tabs.Trigger>
		</Tabs.List>

		<form
			action="/api/events"
			autocomplete="off"
			use:enhance={handleSubmit}
			enctype="multipart/form-data"
			method="POST"
			class="h-full w-full"
		>
			{@render basicInfo()}
			{@render media()}
		</form>
	</Tabs.Root>
</div>

{#snippet basicInfo()}
	<Tabs.Content value="basicInfo">
		<div class="px-2">
			<div>
				<div class="space-y-4">
					<div class="mt-6">
						<Label for="name">Event Name</Label>
						<Input id="name" bind:value={nameVal} type="text" required class="mt-1" />
					</div>
					<div>
						<Label for="description">Description</Label>
						<Textarea id="description" bind:value={despVal} required class="mt-1" />
					</div>

					<div class="flex items-center pt-10">
						<h1 class="text-2xl font-semibold"><Calendar class="inline" /> Date</h1>

						<div class="ml-auto flex items-center space-x-2">
							<Checkbox id="terms" bind:checked={includeTime} aria-labelledby="terms-label" />
							<Label
								id="terms-label"
								for="terms"
								class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Include time
							</Label>
						</div>

						<div class="ml-4">
							<Select.Root type="single" name="favoriteFruit" bind:value={selectedType}>
								<Select.Trigger class="w-[180px]">
									{triggerContent}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each eventType as type}
											<Select.Item value={type.value} label={type.label}>{type.label}</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>
					</div>

					{@render date()}

					{@render time()}

					<div class="flex items-center space-x-4 pt-4">
						<h1 class="text-2xl font-semibold"><MapPin class="inline" /> Event Venue</h1>
					</div>
					<div class="rounded-2xl border px-4 pb-4 pt-2">
						<StepLocation plainNameAttribute optionalMapLink />
					</div>
				</div>
			</div>

			<div class="mt-4 flex space-x-2">
				<Button variant="destructive" href="/adm/events" class="ml-auto">Cancel</Button>
				<Button onclick={() => (currentStep = 'media')}><span>Next</span><ArrowRight /></Button>
			</div>
		</div>
	</Tabs.Content>
{/snippet}

{#snippet media()}
	<Tabs.Content value="media">
		<div>
			<div>
				<MediaAdder bind:previewUrls />
			</div>
			<div class="mt-4 flex space-x-2">
				<Button variant="outline" class="ml-auto" onclick={() => (currentStep = 'basicInfo')}>
					<ArrowLeft />
					<span> Previous </span>
				</Button>
				<Button type="submit" disabled={isLoading}>
					{#if isLoading}
						<Loader class="animate-spin" />
					{/if}
					<span>Submit</span>
				</Button>
			</div>
		</div>
	</Tabs.Content>
{/snippet}

{#snippet date()}
	<div class="flex space-x-4">
		<div class="flex-1">
			{#if selectedType === 'one_time'}
				<div in:fade={{ duration: 150 }}>
					<Label for="start_datetime">Start Date</Label>
					<Input
						class="mt-1 block"
						required
						type="date"
						min={tomorrow()}
						id="start_datetime"
						bind:value={selectedStartDate}
						onchange={() => (selectedEndDate = '')}
					/>
				</div>
			{/if}

			{#if selectedType === 'yearly'}
				<div in:fade={{ duration: 150 }}>
					<span class="block text-sm font-medium leading-7">Month&lpar;s&rpar;</span>
					<!-- {@render month()} -->
					<MonthRange bind:selectedStartMonth bind:selectedEndMonth />
				</div>
			{/if}

			{#if selectedType === 'monthly'}
				<div in:fade={{ duration: 150 }}>
					<span class="block text-sm font-medium leading-7">Month</span>
					{@render month()}
				</div>
			{/if}
		</div>
		<div class="flex-1">
			{#if selectedType === 'one_time'}
				<div in:fade={{ duration: 150 }}>
					<Label for="end_datetime">End Date</Label>
					<Input
						class="mt-1 block"
						type="date"
						required
						id="end_datetime"
						name="end_datetime"
						min={minOneTimeDate}
						max={maxEndDate}
						bind:value={selectedEndDate}
					/>
				</div>
			{/if}

			{#if selectedType === 'monthly' || (selectedType === 'yearly' && !selectedEndMonth)}
				<div>
					<span class="block text-sm font-medium leading-7">Day&lpar;s&rpar;</span>
					<DayRange
						bind:open={openDayRange}
						bind:startVal
						bind:endVal
						onOpenChange={() => {
							if (openMonth) openMonth = false;
						}}
					/>
				</div>
			{/if}

			{#if selectedType === 'yearly' && selectedEndMonth}
				<div in:fade={{ duration: 150 }} class="flex space-x-2">
					<div class="w-full">
						<span class="block text-sm font-medium leading-7"
							>{selectedEndMonth ? 'Day start' : 'Day'}</span
						>
						<DaySelect bind:selectedDay={selectedStartDay} month={Number(selectedStartMonth)} />
					</div>

					<div class="w-full">
						<span class="block text-sm font-medium leading-7">Day end</span>
						<DaySelect bind:selectedDay={selectedEndDay} month={Number(selectedEndMonth)} />
					</div>
				</div>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet time()}
	{#if includeTime}
		<div class="mt-4 flex items-center" transition:fade={{ duration: 150 }}>
			<Clock3 />
			<h1 class="ml-2 text-2xl font-semibold">Time</h1>
			<div class="ml-auto flex items-center space-x-2">
				{@render timeTypes()}
			</div>
		</div>

		{@render timeMessages()}

		<div class="flex space-x-4" in:fade={{ duration: 150 }}>
			<div class="flex-1">
				<Label for="start_time">Start Time</Label>
				<Input
					class="mt-1 block"
					required
					type="time"
					id="start_time"
					bind:value={selectedStartTime}
				/>
			</div>
			{#if timeType !== '24_Hour'}
				<div class="flex-1" transition:fade={{ duration: 150 }}>
					<Label for="end_time">End Time</Label>
					<Input
						class="mt-1 block"
						required
						type="time"
						id="end_time"
						disabled={timeType === 'whole_day'}
						bind:value={selectedEndTime}
					/>
				</div>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet month()}
	<Popover.Root
		bind:open={openMonth}
		onOpenChange={() => {
			if (openMonth || openDay) {
				openDay = false;
			}

			if (selectedType === 'monthly' && openDayRange) {
				openDayRange = false;
			}
		}}
	>
		<Popover.Trigger
			class={buttonVariants({
				variant: 'outline',
				className: 'block w-full text-start text-muted-foreground hover:text-muted-foreground'
			})}>{selectedMonth ? months[Number(selectedMonth) - 1].name : 'Select Month'}</Popover.Trigger
		>
		<Popover.Content align="start" class="w-max px-2">
			<div class="grid grid-cols-4 gap-2">
				{#each months as month}
					{@const isSelected = selectedMonth === month.value}
					<button
						class="rounded p-2 text-sm transition-colors hover:bg-muted hover:text-accent-foreground data-[selected=true]:bg-primary"
						tabindex="-1"
						data-selected={isSelected}
						onclick={() => {
							selectedMonth = month.value;
							openMonth = false;

							if (!selectedDay) {
								openDay = true;
							}

							if (selectedType === 'monthly' && !openDayRange) {
								openDayRange = true;
							}
						}}>{month.name}</button
					>
				{/each}
			</div>
		</Popover.Content>
	</Popover.Root>
{/snippet}

{#snippet timeTypes()}
	<div>
		<RadioGroup.Root bind:value={timeType} class="flex space-x-2">
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="default" id="r1" />
				<Label for="r1">Default</Label>
			</div>
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="whole_day" id="r2" />
				<Label for="r2">Whole Day</Label>
			</div>
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="24_Hour" id="r3" />
				<Label for="r3">24-Hour Event</Label>
			</div>
		</RadioGroup.Root>
	</div>
{/snippet}

{#snippet timeMessages()}
	{#if timeType === 'default' && selectedStartTime && selectedStartTime && selectedStartTime === selectedEndTime}
		<div
			in:fade={{ duration: 200 }}
			class="rounded-lg border border-yellow-500 bg-yellow-500/10 p-4"
		>
			The start and end times are the same. When you save, the time range will be automatically
			adjusted to a <span class="font-semibold">'24-hour event'</span> starting at
			<span class="font-semibold">{formatTimeWithAMPM(selectedStartTime)}</span>.
		</div>
	{/if}

	{#if timeType === 'whole_day'}
		<div
			transition:fade={{ duration: 200 }}
			class="rounded-lg border border-yellow-500 bg-yellow-500/10 p-4"
		>
			The <span class="font-semibold">'Whole Day'</span>option will be set to a
			<span class="font-semibold">12-hour</span> duration. The end time will be automatically
			adjusted to
			<span class="font-semibold">12 hours</span> after the start time.
		</div>
	{/if}
{/snippet}
