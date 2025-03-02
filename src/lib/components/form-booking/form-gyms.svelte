<script lang="ts">
	import { Bed, BedDouble, CircleCheck, Clock4, DoorOpen } from 'lucide-svelte';
	import Separator from '../ui/separator/separator.svelte';
	type GenericType = { [key: string]: unknown };

	let { id, data }: { id: number; data: GenericType } = $props();

	type Gym = {
		rate: string;
		basis: string;
		operationDays: string;
		startTime: string;
		endTime: string;
		typeOfEquip: string[];
		additionalAmenities: string[];
	};

	const datas = data as Gym;
</script>

<div class="text-md">
	<span class="leading-none text-muted-foreground">Prices from</span>
	<div>
		<span class="text-xl font-semibold">&#8369;{datas.rate}</span>/<span>{datas.basis}</span>
	</div>

	<Separator />

	<div class="mt-2 flex text-lg">
		<div class="mr-3"><Clock4 class="size-6 text-green-600" /></div>
		<div>{datas.startTime} - {datas.endTime}</div>
	</div>

	<div class="mt-2 flex text-lg">
		<div class="mr-3"><DoorOpen class="size-6 text-green-600" /></div>
		<div class="capitalize">{datas.operationDays.replace(/,/g, ', ')}</div>
	</div>

	{#if datas.typeOfEquip.length > 0}
		<h2 class="mt-4 text-xl font-medium">Equipment Available</h2>
	{/if}
	{#each datas.typeOfEquip as [] as equipment}
		<div class="h-5 text-lg capitalize">&bull; {equipment}</div>
	{/each}

	{#if datas.additionalAmenities.length > 0}
		<h2 class="mt-4 text-xl font-medium">What's included</h2>
	{/if}
	{#each datas.additionalAmenities as [] as amenity}
		<div class="h-5 text-lg capitalize">&bull; {amenity}</div>
	{/each}
</div>
