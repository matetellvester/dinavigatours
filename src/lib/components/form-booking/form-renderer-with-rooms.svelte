<script lang="ts">
	import {
		Trees,
		Clock4,
		CircleCheck,
		X,
		Scaling,
		UsersRound,
		PhilippinePeso
	} from 'lucide-svelte';
	import { onMount } from 'svelte';

	import { Bed, BedDouble } from 'lucide-svelte';
	import { rooms } from '$bns-route/b/list/new/index.svelte';
	import { sineIn } from 'svelte/easing';
	import { Button } from '../ui/button';
	type GenericType = { [key: string]: unknown };

	let { data, onClick: onclick }: { data: GenericType; onClick?: () => void } = $props();

	type Accomodation = {
		rate: string;
		from: string;
		to: string;
		roomTypes: {};
		bedTypes: {};
		amenities: string[];
		rooms: Room[];
	};

	const datas = data as Accomodation;

	// function getHighestAndLowestPrice(rooms: Room[]): { highest: number; lowest: number } {
	// 	const prices = rooms.map((room) => parseFloat(room.info.price));
	// 	const highest = Math.max(...prices);
	// 	const lowest = Math.min(...prices);
	// 	return { highest, lowest };
	// }

	// const range = getHighestAndLowestPrice(datas.rooms);
</script>

<div>
	<div class="mb-4 font-poppins text-xl font-bold">Rooms</div>
	<div class="space-y-4">
		{#each datas.rooms as room}
			<div class="grid grid-cols-2 gap-4 rounded-lg bg-background/80 p-6">
				<div class="border-r">
					<div class="block font-poppins text-lg font-semibold">
						{room.info.name}
					</div>

					<div class="mt-4">
						<!-- TYPE -->
						<div class="flex items-center space-x-2">
							<Scaling class="size-4" />
							<div>
								{room.info.type}
							</div>
						</div>
						<!-- Capacity -->
						<div class="flex items-center space-x-2">
							<UsersRound class="size-4" />
							<div>
								{room.info.capacity}
							</div>
						</div>
					</div>
				</div>

				<!-- Beds and Facilities -->
				<div class="space-y-4">
					{@render items('Beds', room.beds)}

					{@render items('Facilities', room.amenities)}
				</div>

				<div class="col-span-2 flex border-t pt-4">
					<div class="flex items-center font-poppins text-lg font-semibold text-primary">
						<PhilippinePeso />
						<span class="ml-1">{room.info.price}</span>
					</div>

					<Button {onclick} type="button" size="sm" class="ml-auto">Book</Button>
				</div>
			</div>
		{/each}
	</div>
	<!-- <h2 class="flex items-center space-x-1 text-lg font-medium">
		<Bed class="size-4 text-green-600" />
		<span class="">Bed types available</span>
	</h2>

	<div class="pl-5 text-lg capitalize">
		{#each Object.entries(datas.roomTypes).map(([key]) => key) as item}
			<div class="h-5">{item}</div>
		{/each}
	</div>

	<h2 class="mt-4 flex items-center space-x-1 text-lg font-medium">
		<BedDouble class="size-4 text-green-600" />
		<span class="">Bed size available</span>
	</h2>

	<div class="pl-5 text-lg capitalize">
		{#each Object.entries(datas.bedTypes).map(([key]) => key) as item}
			<div class="h-5">{item}</div>
		{/each}
	</div>

	{#if datas.amenities.length > 0}
		<h2 class="mb-2 mt-4 text-xl font-medium">What's included</h2>

		<div class="text-lg capitalize">
			{#each datas.amenities as amenity}
				<div class="flex">
					<div class="mr-3"><CircleCheck class="size-5 text-green-600" /></div>
					<div class="h-5 leading-4">{amenity}</div>
				</div>
			{/each}
		</div>
	{/if} -->
</div>

{#snippet items(name: string, items: string[])}
	{#if items.length}
		<div>
			<div class="block font-poppins font-semibold">{name}</div>

			<div class="flex space-x-2">
				{#each items as room}
					<div class="w-max rounded border px-2 py-0.5 capitalize">{room}</div>
				{/each}
			</div>
		</div>
	{/if}
{/snippet}
