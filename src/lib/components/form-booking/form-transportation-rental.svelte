<script lang="ts">
	import Separator from '../ui/separator/separator.svelte';
	import { Timer, UsersRound } from 'lucide-svelte';

	type GenericType = { [key: string]: unknown };

	let { id, data }: { id: number; data: GenericType } = $props();

	type Transportation = {
		rate: string;
		basis: string;
		maximumCapacity: string;
		overdueCharge: string;
	};

	const datas = $state(data as Transportation);
</script>

<div class="text-md">
	<span class="leading-none text-muted-foreground">Prices from</span>
	<div>
		<span class="text-xl font-semibold">&#8369;{datas.rate}</span>/<span>{datas.basis}</span>
	</div>

	<Separator />

	<div class="mt-4 flex items-center space-x-3 text-lg">
		<UsersRound class="size-6 text-green-600" /> <span>Person Limit: {datas.maximumCapacity}</span>
	</div>
	<div class="flex items-center space-x-3 text-lg">
		<Timer class="size-6 text-green-600" /> <span>Overdue Charge: {datas.overdueCharge}</span>
	</div>
</div>
