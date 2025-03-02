<script lang="ts">
	import { Bed, BedDouble, CircleCheck } from 'lucide-svelte';
	type GenericType = { [key: string]: unknown };

	let { id, data }: { id: number; data: GenericType } = $props();

	type Accomodation = {
		rate: string;
		from: string;
		to: string;
		roomTypes: {};
		bedTypes: {};
		amenities: string[];
	};

	const datas = data as Accomodation;
</script>

<div>
	<span class="leading-none text-muted-foreground">Prices from</span>
	<div>
		<span class="text-xl font-semibold">&#8369;{datas.from} - {datas.to}</span>
	</div>
	<!-- <span>{datas.roomTypes}</span> -->

	<h2 class="mt-4 flex items-center space-x-1 text-lg font-medium">
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

	<!-- <span>{datas.bedTypes}</span> -->

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
	{/if}
</div>
