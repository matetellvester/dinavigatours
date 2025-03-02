<script lang="ts">
	import { Trees, Clock4, CircleCheck, X } from 'lucide-svelte';
	type GenericType = { [key: string]: unknown };

	let { id, data }: { id: number; data: GenericType } = $props();

	type Tour = {
		joinin: string | null;
		private: string | null;
		departureTime: string;
		returnTime: string;
		placeOrder: string[];
		included: string[] | null;
		excluded: string[] | null;
	};

	const datas = $state(data as Tour);
</script>

<!-- ROUTE -->
<div class="flex text-lg">
	<div class="mr-2"><Trees class="size-6 text-green-600" /></div>
	<div>
		{#each datas.placeOrder as [] as place}
			<div class="capitalize">{place}</div>
		{/each}
	</div>
</div>

<!-- TIME -->
<div class="mt-2 flex text-lg">
	<div class="mr-3"><Clock4 class="size-6 text-green-600" /></div>
	<div>{datas.departureTime} - {datas.returnTime}</div>
</div>

{#if datas.included}
	<h2 class="mb-3 mt-4 text-xl font-medium">What's included</h2>

	<div class="flex flex-col space-y-1">
		{#each datas.included as [] as included}
			<div class="flex text-lg">
				<div class="mr-3"><CircleCheck class="size-6 text-green-600" /></div>
				<div class="capitalize leading-6">{included}</div>
			</div>
		{/each}

		{#if datas.excluded}
			{#each datas.excluded as [] as excluded}
				<div class="flex text-lg">
					<div class="mr-3"><X class="size-6 text-muted-foreground" /></div>
					<div class="capitalize leading-6">{excluded}</div>
				</div>
			{/each}
		{/if}
	</div>
{:else if !datas.included && datas.excluded}
	<h2 class="mb-3 mt-4 text-xl font-medium">What's excluded</h2>
	{#each datas.excluded as [] as excluded}
		<div class="flex text-lg">
			<div class="mr-3"><X class="size-6 text-muted-foreground" /></div>
			<div class="capitalize leading-6">{excluded}</div>
		</div>
	{/each}
{/if}
