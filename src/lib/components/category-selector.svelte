<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Button } from '$lib/components/ui/button';
	import { MoveLeft } from 'lucide-svelte';
	import { Category_, getSubcategoriesNonBook } from '$lib/constant/category';

	interface Props {
		type?: 'nonBook' | 'canbook';
		/**Mo return og selected sub category*/
		onSelect: (selected: string | null) => void;
	}

	let { type = 'nonBook', onSelect }: Props = $props();

	let selectedCategory: string | null = $state(null);
	let selectedSubCategory: string | null = $state(null);

	let lastSelectedCategory: string | null = $state(null);
	let lastSelectedSubCategory: string | null = $state(null);

	let choices: string[] = $state(Object.values(Category_));

	const handleCategorySelect = (category: string) => {
		selectedCategory = category;
		lastSelectedCategory = category;
		choices = getSubcategoriesNonBook(category as Category_);
	};

	const backToCategories = () => {
		selectedCategory = null;
		selectedSubCategory = null;
		choices = Object.values(Category_);
		// onSelect(null);
	};
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
					variant={lastSelectedCategory === category ? 'default' : 'outline'}
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
		<Button class="mb-4" variant="ghost" onclick={backToCategories}>
			<MoveLeft />
			Back to Main Categories
			<i class="text-muted-foreground">&lpar;{lastSelectedCategory}&rpar;</i>
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
							selectedSubCategory = subcategory.replaceAll(/ /g, '');
							lastSelectedSubCategory = subcategory.replaceAll(/ /g, '');
							onSelect(subcategory);
						}}
					>
						{subcategory}
					</Button>
				{/each}
			</div>
		</RadioGroup.Root>
	</div>
{/if}
