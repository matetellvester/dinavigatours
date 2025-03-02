<script lang="ts">
	import { getFormBookingComponent } from '.';
	import Skeleton from '../ui/skeleton/skeleton.svelte';

	let { id, onClick }: { id: number; onClick?: () => void } = $props();

	type GenericType = { [key: string]: unknown };

	// svelte-ignore non_reactive_update
	let branch = '';

	async function fetchBasicInfo(): Promise<GenericType> {
		const res = await fetch(`/api/ltsng-basic-info/${id}?columns=branch,branch_info,rooms`);

		if (!res.ok) {
			throw new Error(await res.text());
		}

		const result = await res.json();
		if (result.success) {
			const data = result.data as {
				branch: string;
				branch_info: GenericType;
				rooms: Room[] | null;
			};

			branch = data.branch;

			return { ...data.branch_info, rooms: data.rooms };
		} else {
			throw new Error(result.error || 'Unknown error occurred');
		}
	}

	let dataPromise = fetchBasicInfo();
</script>

<div class="mt-6 flex items-center">
	<span class="h-6 w-2 rounded-full bg-primary"></span>
	<h1 class="px-4 py-2 text-xl font-bold text-foreground">Package Information</h1>
</div>

{#await dataPromise}
	<div class="mt-6 rounded-lg p-4">
		<div class="flex space-x-2">
			<div class="w-max space-y-2">
				<Skeleton class="h-4 w-6" />
				<Skeleton class="h-4 w-6" />
				<Skeleton class="h-4 w-6" />
				<Skeleton class="h-4 w-6" />
				<Skeleton class="h-4 w-6" />
			</div>
			<div class="flex w-full flex-col space-y-2">
				<Skeleton class="h-4 w-1/4" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-10/12" />
				<Skeleton class="h-4 w-1/2" />
				<Skeleton class="h-4 w-10/12" />
			</div>
		</div>
	</div>
{:then data}
	<div
		class="mt-6 rounded-lg bg-primary/10 p-5 text-foreground shadow-sm ring-1 ring-inset ring-primary/50"
	>
		{#if !data.rooms}
			{@const Comp = getFormBookingComponent(branch)}
			<Comp {data} />
		{:else}
			{#await import('./form-renderer-with-rooms.svelte') then Form}
				<Form.default {data} {onClick} />
			{/await}
		{/if}
	</div>
{/await}
