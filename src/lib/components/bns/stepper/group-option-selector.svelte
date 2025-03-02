<script lang="ts">
	import Location from '$lib/components/svg/location.svelte';
	import Ok from '$lib/components/svg/ok.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Toggle } from '$lib/components/ui/toggle/index.js';
	import { cn, makeNameAttribute } from '$lib/utils';
	import { CirclePlus, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { format } from 'date-fns';

	let isJoinTour: boolean = $state(false);
	let isPrivateTour: boolean = $state(false);

	let joinTourVal: string = $state('');
	let privateTourVal: string = $state('');
	let rate = $derived(Math.max(Number(joinTourVal), Number(privateTourVal)));

	let departureTime = $state('');
	let returnTime = $state('');

	let placeAdderValue = $state('');
	let includedAdderValue = $state('');
	let excludedAdderValue = $state('');

	let placeEl: HTMLInputElement | null = null;
	let includedEl: HTMLInputElement | null = null;
	let excludedEl: HTMLInputElement | null = null;

	let places: { id: number; name: string }[] = $state([]);
	let included: { id: number; name: string }[] = $state([]);
	let excluded: { id: number; name: string }[] = $state([]);

	let id = 1;

	// const name = makeNameAttribute('included')

	function remove(id: number, varName: 'places' | 'included' | 'exlcuded' = 'places') {
		if (varName === 'places') {
			places = places.filter((p) => p.id !== id);
		}

		if (varName === 'included') {
			included = included.filter((p) => p.id !== id);
		}

		if (varName === 'exlcuded') {
			excluded = excluded.filter((p) => p.id !== id);
		}
	}

	function formatTime(time: string) {
		if (!time.trim()) return '-- --';

		const [hours, minutes] = time.split(':').map(Number);
		const date = new Date();
		date.setHours(hours, minutes);

		return format(date, 'h:mm a');
	}
	const className = cn(
		'group data-[state=on]:bg-primary/5 data-[state=on]:border-primary active:scale-[99%] hover:bg-transparent hover:text-foreground border hover:border-primary'
	);

	onMount(() => {
		placeEl = document.getElementById('placeAdderInputEl') as HTMLInputElement | null;
		includedEl = document.getElementById('includedAdderInputEl') as HTMLInputElement | null;
		excludedEl = document.getElementById('excludedAdderInputEl') as HTMLInputElement | null;
	});
</script>

<div class="size-0 opacity-0 [&>input]:size-0 [&>input]:opacity-0">
	<input type="hidden" name="joinin" value={isJoinTour ? joinTourVal : ''} />
	<input type="hidden" name="private" value={isPrivateTour ? privateTourVal : ''} />

	<input type="hidden" name="departureTime" value={departureTime} />
	<input type="hidden" name="returnTime" value={returnTime} />

	<input type="hidden" name="rate" value={rate} />
</div>

<h1 class="mb-4 font-medium text-muted-foreground">Tour Type Available</h1>
<div class="flex space-x-2">
	<div class="flex w-max flex-col space-y-2">
		<Toggle bind:pressed={isJoinTour} class={className}>
			<div class="rounded-full bg-primary/10">
				<Ok class="transition-opacity {isJoinTour ? 'opacity-100' : 'opacity-0'}" />
			</div>
			<span>Join-In Tour</span>
		</Toggle>

		<Toggle bind:pressed={isPrivateTour} class={className}>
			<div class="rounded-full bg-primary/10">
				<Ok class="transition-opacity {isPrivateTour ? 'opacity-100' : 'opacity-0'}" />
			</div>
			<span>Private Tour</span>
		</Toggle>
	</div>

	<div class="flex-1 space-y-2">
		<Input
			min="1"
			type="number"
			bind:value={joinTourVal}
			aria-label="Join-In Tour Price"
			placeholder="Join-In Tour Price"
			disabled={!isJoinTour}
		/>
		<Input
			min="1"
			type="number"
			bind:value={privateTourVal}
			aria-label="Private Tour Price"
			placeholder="Private Tour Price"
			disabled={!isPrivateTour}
		/>
	</div>
</div>

<h1 class="mb-2 mt-10 font-medium text-muted-foreground">Tour Itinerary</h1>

<div>
	<div class="flex space-x-2">
		<div class="w-full">
			<Label for="departure">Departure</Label>
			<Input id="departure" type="time" class="block" bind:value={departureTime} />
		</div>
		<div class="w-full">
			<Label for="return">Return</Label>
			<Input id="return" type="time" class="block" bind:value={returnTime} />
		</div>
	</div>

	<div class="mt-4">
		<div class="flex space-x-2">
			<Input
				id="placeAdderInputEl"
				type="text"
				aria-label="add place"
				placeholder="Place name"
				bind:value={placeAdderValue}
			></Input>
			<Button
				variant="outline"
				type="button"
				disabled={placeAdderValue.trim() == ''}
				onclick={() => {
					places.push({ id: id++, name: placeAdderValue });
					placeAdderValue = '';
					placeEl?.focus();
				}}><CirclePlus /></Button
			>
		</div>

		<div class="mt-4 pl-4">
			{@render itinerary()}
		</div>
	</div>
</div>

<h1 class="mb-2 mt-10 font-medium text-muted-foreground">Add inclusions to the tour</h1>

<div>
	<div class="flex space-x-2">
		<Input
			type="text"
			id="includedAdderInputEl"
			aria-label="add included"
			placeholder="Add an item to the inclusions list..."
			bind:value={includedAdderValue}
		/>
		<Button
			variant="outline"
			type="button"
			disabled={includedAdderValue.trim() == ''}
			onclick={() => {
				included.push({ id: id++, name: includedAdderValue });
				includedAdderValue = '';
				includedEl?.focus();
			}}><CirclePlus /></Button
		>
	</div>

	<div class="mt-4 space-y-2 pl-4">
		{#each included as { name, id }, i}
			<!-- {@render place(name, id)} -->
			<div class="flex items-center">
				<span class="mr-2 size-[6px] -translate-x-[0.150rem] rounded-full bg-muted-foreground/40"
				></span>
				<Input
					type="text"
					aria-label="place name"
					class="pointer-events-none h-6 py-0.5"
					value={name}
					name={`included[${i}]`}
				/>

				<button class="p-1 opacity-60 hover:opacity-100" onclick={() => remove(id, 'included')}>
					<X class="size-4" />
				</button>
			</div>
		{/each}
	</div>
</div>

<h1 class="mb-2 mt-10 font-medium text-muted-foreground">Add exclusions to the tour</h1>

<div>
	<div class="flex space-x-2">
		<Input
			type="text"
			id="excludedAdderInputEl"
			aria-label="add exclude"
			placeholder="Add an item to the exclusions list..."
			bind:value={excludedAdderValue}
		/>
		<Button
			variant="outline"
			type="button"
			disabled={excludedAdderValue.trim() == ''}
			onclick={() => {
				excluded.push({ id: id++, name: excludedAdderValue });
				excludedAdderValue = '';
				excludedEl?.focus();
			}}><CirclePlus /></Button
		>
	</div>

	<div class="mt-4 space-y-2 pl-4">
		{#each excluded as { name, id }, i}
			<!-- {@render place(name, id)} -->
			<div class="flex items-center">
				<span class="mr-2 size-[6px] -translate-x-[0.150rem] rounded-full bg-muted-foreground/40"
				></span>
				<Input
					type="text"
					aria-label="place name"
					class="pointer-events-none h-6 py-0.5"
					value={name}
					name={`excluded[${i}]`}
				/>

				<button
					type="button"
					class="p-1 opacity-60 hover:opacity-100"
					onclick={() => remove(id, 'exlcuded')}
					><X class="size-4" />
				</button>
			</div>
		{/each}
	</div>
</div>

{#snippet itinerary()}
	<!-- Departure -->
	<div class="flex space-x-2 text-sm">
		<div class="w-min rounded-full bg-orange-50 p-1">
			<Location class="size-4" />
		</div>

		<div>
			Departure {formatTime(departureTime)}
		</div>
	</div>

	<div class="min-h-10 translate-x-3 space-y-1 border-l border-muted-foreground/40 py-2">
		{#each places as { name, id }, i}
			<!-- {@render place(name, id)} -->
			<div class="flex items-center">
				<span class="mr-2 size-[6px] -translate-x-[0.150rem] rounded-full bg-muted-foreground/40"
				></span>
				<Input
					type="text"
					aria-label="place name"
					name={`placeOrder[${i}]`}
					class="pointer-events-none h-6 "
					value={name}
				/>

				<button type="button" class="p-1 opacity-60 hover:opacity-100" onclick={() => remove(id)}
					><X class="size-4" /></button
				>
			</div>
		{/each}
	</div>

	<!-- Return -->
	<div class="flex space-x-2 text-sm">
		<div class="w-min rounded-full bg-orange-50 p-1">
			<Location class="size-4" />
		</div>

		<div>
			Return {formatTime(returnTime)}
		</div>
	</div>
{/snippet}
