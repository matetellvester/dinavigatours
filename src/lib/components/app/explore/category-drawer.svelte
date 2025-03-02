<script lang="ts">
	import { LayoutGrid, List, ChevronRight } from 'lucide-svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { AllCategoriesWithIcon } from '$lib/constant/category';
	import { AllAttractionWithIcon } from '$lib/constant/attractions';

	let { open = $bindable(), onClick }: { open: boolean; onClick?: (category: string) => void } =
		$props();

	let currStyle: 'layout' | 'list' = $state('list');
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="fixed bottom-0 left-0 right-0 flex max-h-[90%] flex-col">
		<Drawer.Header>
			<Drawer.Title class="flex items-center justify-between text-left font-poppins font-semibold">
				All categories
				<!-- {@render listType()} -->
			</Drawer.Title>
			<!-- <Drawer.Description>Set your daily activity goal.</Drawer.Description> -->
		</Drawer.Header>
		<div class="overflow-auto p-4 px-0 pb-0 font-poppins">
			{#each Object.entries(AllCategoriesWithIcon) as [_, { name, icon: Icon }]}
				<div class="flex w-auto flex-col items-start border-t first-of-type:border-none">
					<Button
						variant="ghost"
						onclick={() => onClick?.(name.replace(/\s+/g, ''))}
						class="text-md w-full justify-start rounded-none py-6 max-sm:hover:bg-transparent [&_svg]:size-7"
					>
						<Icon />
						<span>
							{name}
						</span>
						<ChevronRight class="size-[1rem_!important] text-foreground/70" />
					</Button>
				</div>
			{/each}
			<div class="mb-4 font-poppins">
				<h3 class="pl-4 pt-4 text-sm font-semibold text-muted-foreground">Attractions</h3>
				{#each Object.entries(AllAttractionWithIcon) as [_, { name, icon: Icon }]}
					<div class="flex w-auto flex-col items-start border-t first-of-type:border-none">
						<Button
							variant="ghost"
							onclick={() => onClick?.(name.replace(/\s+/g, ''))}
							class="text-md w-full justify-start rounded-none py-6 max-sm:hover:bg-transparent [&_svg]:size-7"
						>
							<Icon />
							<span>
								{name}
							</span>
							<ChevronRight class="size-[1rem_!important] text-foreground/70" />
						</Button>
					</div>
				{/each}
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>

{#snippet listType()}
	<button
		onclick={() => {
			currStyle = currStyle === 'layout' ? 'list' : 'layout';
		}}
		class="relative flex w-16 items-center rounded-full border bg-muted p-0.5 transition-colors duration-300"
		aria-label="Toggle theme"
	>
		<div
			class="flex h-7 w-7 transform items-center justify-center rounded-full bg-background p-1 shadow transition-transform duration-300"
			class:translate-x-[1.90rem]={currStyle === 'list'}
		></div>

		<div class="absolute z-10 flex w-full justify-between px-[0.4rem] text-muted-foreground">
			<span class:text-primary={currStyle === 'layout'} class="size-4">
				<LayoutGrid class="h-full w-full " />
			</span>

			<span class:text-primary={currStyle === 'list'} class="size-4">
				<List class="h-full w-full -translate-x-[0.14rem] " />
			</span>
		</div>
	</button>
{/snippet}
