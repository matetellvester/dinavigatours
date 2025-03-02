<script lang="ts">
	import { HandHeart, Clock4, DoorOpen } from 'lucide-svelte';
	import Separator from '../ui/separator/separator.svelte';
	type GenericType = { [key: string]: unknown };

	let { id, data }: { id: number; data: GenericType } = $props();

	type MassageTherapy = {
		rate: string;
		basis: string;
		operationDays: string;
		startTime: string;
		endTime: string;
		typeOfMassage: string;
	};

	const datas = data as MassageTherapy;
</script>

<div class="text-md">
	<span class="leading-none text-muted-foreground">Prices from</span>
	<div>
		<span class="text-xl font-semibold">&#8369;{datas.rate}</span>/<span>{datas.basis}</span>
	</div>

	<Separator />

	<div class="mt-2 flex text-lg">
		<div class="mr-3"><HandHeart class="size-6 text-green-600" /></div>
		<div>{datas.typeOfMassage}</div>
	</div>

	<div class="mt-2 flex text-lg">
		<div class="mr-3"><Clock4 class="size-6 text-green-600" /></div>
		<div>{datas.startTime} - {datas.endTime}</div>
	</div>

	<div class="mt-2 flex text-lg">
		<div class="mr-3"><DoorOpen class="size-6 text-green-600" /></div>
		<div class="capitalize">{datas.operationDays.replace(/,/g, ', ')}</div>
	</div>
</div>
