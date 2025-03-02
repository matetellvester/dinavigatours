<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EventsList from '$lib/components/app/events-list.svelte';
	import Explore from '$lib/components/app/explore.svelte';
	import CategoryDrawer from '$lib/components/app/explore/category-drawer.svelte';
	import { QuestionMark } from '$lib/components/svg';
	import { Button } from '$lib/components/ui/button';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import { AllAttractionsArrs } from '$lib/constant/attractions';
	import { Category_, getSubcategoriesNonBook } from '$lib/constant/category';
	import { FilterX } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import type { PageData } from './$types';
	import { exploreList } from './index.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let queryParams = $derived($page.url.searchParams.get('filter'));
	let attrParam = $derived($page.url.searchParams.get('attraction'));

	let open = $state(false);

	$effect(() => {
		const filters = parseFilter(queryParams); // Parse the query param into an array
		if (filters.length) {
			exploreList.value = data.exploreItems.filter((e) => filters.includes(e.branch));
			return;
		}

		if (!attrParam) {
			exploreList.value = data.exploreItems;
		}

		exploreList.value = data.exploreItems; // Show all items if no filters are provided
	});

	function parseFilter(param: string | null) {
		return param ? param.split(',') : [];
	}

	async function addQueryParam(value: string) {
		const params = new URLSearchParams(window.location.search);
		params.set('filter', value.replace(/\s+/g, ''));
		goto(`/explore?filter=${value.replace(/\s+/g, '')}`);
		await tick();
	}

	onMount(() => {
		const filters = parseFilter(queryParams);

		if (filters.length) {
			exploreList.value = data.exploreItems.filter((e) => filters.includes(e.branch));
			return;
		}

		if (attrParam) {
			exploreList.value = data.exploreItems.filter((e) => e.can_book == false);
			return;
		}

		exploreList.value = data.exploreItems;
	});
</script>

<svelte:head>
	<title>Explore</title>
</svelte:head>

<div class="">
	<div class="w-full rounded-md px-4 py-4 xl:px-0">
		<div class="max-sm:hidden">
			{@render bigScreenfilter()}
		</div>

		<div class="flex items-center sm:hidden">
			<Button
				disabled={queryParams == null && attrParam == null}
				onclick={() => goto('/explore')}
				class="rounded-full text-destructive"
				variant="secondary"
			>
				<FilterX /><span>Clear</span>
			</Button>
			<Button
				class="ml-2 w-full truncate rounded-full
        {queryParams && attrParam ? 'border-primary' : 'text-muted-foreground'}"
				variant="outline"
				onclick={() => (open = true)}
			>
				{queryParams
					? queryParams.replace(/([A-Z])/g, ' $1').trim()
					: attrParam
						? 'Attractions'
						: 'Select Category'}
			</Button>
		</div>
	</div>
</div>
<div class="pb-20">
	<Explore items={exploreList.value} />

	{#if !exploreList.value.length && queryParams}
		<div class="flex w-full flex-col items-center">
			<QuestionMark class="size-20" />
			<span>No result found! </span>
			<Button href="/explore" class="text-blue-600 hover:text-blue-600" variant="link" size="sm"
				>Clear filter</Button
			>
		</div>
	{/if}
	<div>
		<EventsList />
	</div>
</div>

{#snippet bigScreenfilter()}
	<Menubar.Root class="border-none">
		<Button
			disabled={queryParams == null && attrParam == null}
			onclick={() => goto('/explore')}
			class="rounded-full text-destructive"
			variant="secondary"
			size="sm"
		>
			<FilterX /><span>Clear</span>
		</Button>
		{#each Object.values(Category_) as categ}
			<Menubar.Menu>
				<Menubar.Trigger class="rounded-full">{categ}</Menubar.Trigger>
				<Menubar.Content>
					{#each getSubcategoriesNonBook(categ) as item}
						<Menubar.Item onclick={() => addQueryParam(item)}>
							{item}
						</Menubar.Item>
					{/each}
				</Menubar.Content>
			</Menubar.Menu>
		{/each}

		<!-- ATTRACTIONS -->
		<Menubar.Menu>
			<Menubar.Trigger class="rounded-full">Attraction</Menubar.Trigger>
			<Menubar.Content>
				{#each Object.entries(AllAttractionsArrs) as [category, attractions]}
					<Menubar.Sub>
						<Menubar.SubTrigger>
							{category
								.replace(/([A-Z])/g, ' $1')
								.trim()
								.replaceAll('And', 'and')}
						</Menubar.SubTrigger>
						<Menubar.SubContent>
							{#each attractions as attraction}
								<Menubar.Item onclick={() => addQueryParam(attraction)}>
									{attraction}
								</Menubar.Item>
							{/each}
						</Menubar.SubContent>
					</Menubar.Sub>
				{/each}
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
{/snippet}

<CategoryDrawer
	bind:open
	onClick={async (val) => {
		addQueryParam(val);
		await tick();
		open = false;
	}}
/>
