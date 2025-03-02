<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Button } from '$lib/components/ui/button';
	import { MoveLeft } from 'lucide-svelte';
	import { AllAttractions, getAllSubCategAttraction } from '$lib/constant/attractions';
	import { onMount } from 'svelte';

	interface Props {
		inital?: {
			categ: string;
			sub_categ: string;
		};
		onSelect?: (selected: string | null) => void;
	}

	let { inital, onSelect }: Props = $props();

	let selectedCategory: string | null = $state(null);
	let lastSelectedCategory: string | undefined = $state(undefined);
	let lastSelectedSubCategory: string | undefined = $state(undefined);
	let choices: string[] = $state([]);

	const handleCategorySelect = (category: string) => {
		const categ = category.replaceAll(/ /g, '');

		selectedCategory = categ;
		lastSelectedCategory = category;
		choices = getAllSubCategAttraction(categ as keyof typeof AllAttractions);
	};

	const backToCategories = () => {
		selectedCategory = null;
		choices = Object.values(AllAttractions);
	};

	onMount(() => {
		if (inital) {
			lastSelectedCategory = inital.categ.replaceAll(/ /g, '');
			lastSelectedSubCategory = inital.sub_categ.replaceAll(/ /g, '');
			selectedCategory = inital.categ.replaceAll(/ /g, '');
			choices = getAllSubCategAttraction(lastSelectedCategory as keyof typeof AllAttractions);
		} else {
			choices = Object.values(AllAttractions);
		}
	});
</script>

<input
	type="hidden"
	aria-label="main category"
	name="main_categ"
	bind:value={lastSelectedCategory}
/>
<input
	type="hidden"
	aria-label="sub category"
	name="sub_categ"
	bind:value={lastSelectedSubCategory}
/>

{#if !selectedCategory}
	<RadioGroup.Root>
		<div class="flex flex-wrap space-x-2 space-y-2">
			{#each choices as category, i}
				<RadioGroup.Item id={category + i} value={category} class="sr-only" />
				<Label for={category + i} class="sr-only">{category}</Label>
				<Button
					class="rounded-full capitalize"
					variant={(lastSelectedCategory?.replaceAll(/ /g, '') ?? '') ===
					category.replaceAll(/ /g, '')
						? 'default'
						: 'outline'}
					onclick={() => handleCategorySelect(category)}
				>
					{category}
				</Button>
			{/each}
		</div>
	</RadioGroup.Root>
{:else}
	<!-- Render Subcategories -->
	<div>
		<Button
			class="mb-4 flex h-auto flex-col items-start"
			variant="ghost"
			onclick={backToCategories}
		>
			<span class="inline-flex items-center text-nowrap">
				<MoveLeft class="mr-2" />
				Back to Main Categories
			</span>

			<i class="pb-2 pl-6 text-xs leading-none text-muted-foreground"
				>&lpar;{lastSelectedCategory}&rpar;</i
			>
		</Button>
		<RadioGroup.Root>
			<div class="flex flex-wrap space-x-2 space-y-2">
				{#each choices as subcategory, i}
					<RadioGroup.Item id={subcategory + i} value={subcategory} class="sr-only" />
					<Label for={subcategory + i} class="sr-only">{subcategory}</Label>
					<Button
						class="rounded-full capitalize"
						variant={lastSelectedSubCategory === subcategory.replaceAll(/ /g, '')
							? 'default'
							: 'outline'}
						onclick={() => {
							// selectedSubCategory = subcategory.replaceAll(/ /g, '');
							lastSelectedSubCategory = subcategory.replaceAll(/ /g, '');
							onSelect?.(subcategory);
						}}
					>
						{subcategory}
					</Button>
				{/each}
			</div>
		</RadioGroup.Root>
	</div>
{/if}
