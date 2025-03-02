<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Button } from '$lib/components/ui/button';
	import { MoveLeft } from 'lucide-svelte';
	import { Category_, getSubcategoriesNonBook } from '$lib/constant/category';
	import { selectedSubCategory } from './stepSteps.svelte';

	let {
		value = $bindable(''),
		selectedCategory = $bindable(null)
	}: {
		value: string;
		selectedCategory: string | null;
	} = $props(); // For selected subcategory

	// Initial choices are categories
	let choices: string[] = $state(Object.values(Category_));

	// Handlers
	const handleCategorySelect = (category: string) => {
		selectedCategory = category;
		choices = getSubcategoriesNonBook(category as Category_);
	};

	const backToCategories = () => {
		value = '';
		selectedCategory = null;
		choices = Object.values(Category_);
	};
</script>

{#if !selectedCategory}
	<!-- Render Categories -->
	<RadioGroup.Root bind:value>
		<div class="flex flex-wrap space-x-2 space-y-2">
			{#each choices as category, i}
				<RadioGroup.Item id={category + i} value={category} class="sr-only" />
				<Label for={category + i} class="sr-only">{category}</Label>
				<Button
					class="rounded-full capitalize"
					variant="outline"
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
		<Button variant="ghost" class="mb-4" onclick={backToCategories}
			><MoveLeft /> Back to Main Categories</Button
		>
		<RadioGroup.Root bind:value>
			<div class="flex flex-wrap space-x-2 space-y-2">
				{#each choices as subcategory, i}
					<RadioGroup.Item value={subcategory} class="sr-only" />
					<Label for={subcategory + i} class="sr-only">{subcategory}</Label>
					<Button
						class="rounded-full capitalize"
						variant={value === subcategory ? 'default' : 'outline'}
						onclick={() => {
							value = subcategory;
							selectedSubCategory.value = subcategory;
						}}
					>
						{subcategory}
					</Button>
				{/each}
			</div>
		</RadioGroup.Root>
	</div>
{/if}
