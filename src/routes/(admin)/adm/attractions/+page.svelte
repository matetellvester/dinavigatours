<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { Loader } from 'lucide-svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import DataTable from '$lib/components/admin/data-table.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { admAttractionsCols as columns } from '$adm-comps/admin-table-columns';
	import { attractionList, attrtSheetState, selectedAttraction } from './index.svelte';
	import AttracCategorySelector from './add/attrac-category-selector.svelte';
	import StepLocation from '$bns-comps/stepper/step-location.svelte';
	import { admHeader } from '$adm-route/admin.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let isLoading = $state(false);

	onMount(() => {
		admHeader.v = 'Attractions List';
		attractionList.value = data.touristAttractions;
	});

	const handleSubmit: SubmitFunction = ({ formElement }) => {
		isLoading = true;

		return async ({ result, update }) => {
			//@ts-ignore
			if (result.success) {
				const formData = new FormData(formElement);
				const formDataObj = Object.fromEntries(formData.entries()) as any;

				await update({ reset: false });

				const updatedData = {
					name: formDataObj.name,
					rate: formDataObj.rate,
					description: formDataObj.description.replace(/\n/g, ' ').trim(),
					category: formDataObj.main_categ,
					branch: formDataObj.sub_categ,
					municipality: formDataObj['location[municipality]'],
					bgry: formDataObj['location[bgry]'],
					purok: formDataObj['location[purok]'],
					mapLink: formDataObj['location[map_link]']
				};

				if (attractionList.value) {
					attractionList.value = attractionList.value.map((attr) => {
						if (attr.id === selectedAttraction.value?.id) {
							return {
								id: selectedAttraction.value?.id,
								...updatedData
							};
						}
						return attr;
					});
				}

				toast.success('Updated Successfully');
				attrtSheetState.value = false;
			}
			isLoading = false;
		};
	};
</script>

<svelte:head>
	<title>Attractions List | Admin</title>
</svelte:head>

<DataTable data={attractionList.value} {columns} add={{ href: '/adm/attractions/add' }} />

<!-- ######################### -->
<!-- SHEET -->
<Sheet.Root bind:open={attrtSheetState.value}>
	<Sheet.Content side="right" class="pb-36">
		<form
			autocomplete="off"
			class="h-full"
			action="/api/attractions/{selectedAttraction.value?.id}"
			method="POST"
			use:enhance={handleSubmit}
		>
			<Sheet.Header>
				<Sheet.Title>Edit Attraction</Sheet.Title>
				<Sheet.Description>
					Make changes to your profile here. Click save when you're done.
				</Sheet.Description>
			</Sheet.Header>
			{#if selectedAttraction.value}
				<div class="flex h-full flex-col space-y-4 overflow-auto px-1 pt-4">
					<div class="grid grid-cols-1 gap-2">
						<Label for="name">Name</Label>
						<Input id="name" name="name" value={selectedAttraction.value.name} />
					</div>
					<div class="grid grid-cols-1 gap-2">
						<Label for="price">Environmental/Entrance Fee (Optional)</Label>
						<Input id="price" name="rate" value={selectedAttraction.value.rate} />
					</div>
					<div class="grid grid-cols-1 gap-2">
						<Label for="description">Description</Label>
						<Textarea
							id="description"
							name="description"
							value={selectedAttraction.value.description}
						/>
					</div>

					<!-- Category -->
					<div>
						<span class="text-sm font-medium leading-none">Category</span>
						<div class="mt-2 rounded-lg border border-border px-1 py-2">
							<AttracCategorySelector
								inital={{
									categ: selectedAttraction.value.category,
									sub_categ: selectedAttraction.value.branch
								}}
							/>
						</div>
					</div>

					<div>
						<span class="text-sm font-medium leading-none"
							>Location {selectedAttraction.value.bgry}</span
						>
						<div class="mt-2 rounded-lg border border-border px-1 py-2">
							<StepLocation
								initial={{
									municipality: selectedAttraction.value.municipality,
									baranggay: selectedAttraction.value.bgry,
									purok: selectedAttraction.value.purok.toString(),
									mapLink: selectedAttraction.value.mapLink
								}}
							/>
						</div>
					</div>
				</div>
			{/if}
			<Sheet.Footer>
				<Button
					class="mt-4"
					variant="outline"
					type="button"
					onclick={() => (attrtSheetState.value = false)}
				>
					Cancel
				</Button>
				<Button class="mt-4" type="submit">
					{#if isLoading}
						<Loader class="size animate-spin" />
					{/if}
					Save changes
				</Button>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
