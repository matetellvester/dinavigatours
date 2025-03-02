<script lang="ts">
	import type { PageData, SubmitFunction, ActionData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import MediaAdder from './media-adder.svelte';
	import { Loader, ArrowLeft, ArrowRight } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { makeNameAttribute } from '$lib/utils';
	import StepLocation from '$bns-comps/stepper/step-location.svelte';
	import AttracCategorySelector from './attrac-category-selector.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { admHeader } from '$adm-route/admin.svelte';
	import StepContacts from '$bns-comps/stepper/step-contacts.svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let currentStep = $state('basic');

	let previewUrls: {
		src: string;
		name: string;
		copyright: string;
		desp: string;
		path: string;
		file: File;
		isThumbnail: boolean;
		type: 'image' | 'video';
	}[] = $state([]);

	let isLoading = $state(false);

	const handleSubmit: SubmitFunction = ({ formData }: { formData: FormData }) => {
		isLoading = true;

		const [name] = makeNameAttribute('media', { mode: 'objectsInArray' });

		previewUrls.forEach((media, i) => {
			if (media.file instanceof File) {
				formData.append(name('file', i), media.file);
				formData.append(name('type', i), media.type);
				formData.append(name('desp', i), media.desp);
				formData.append(name('copyright', i), media.copyright);
				formData.append(name('isThumbnail', i), String(media.isThumbnail));
			} else {
				console.error('Invalid file object:', media.file);
			}
		});

		return async ({ result, update }) => {
			//@ts-ignore
			if (result.data.success) {
				await update({ reset: false });
				// toast.success('Added Successfully, redirecting please wait...');
				toast.success('Added Successfully');
				await goto('/adm/attractions');
			}
			isLoading = false;
		};
	};

	onMount(() => {
		admHeader.v = 'Add New Attraction';
	});
</script>

{#snippet basic()}
	<div class="space-y-4">
		<!-- Title -->
		<div>
			<Label for="title">Name</Label>
			<Input
				class="mt-1"
				id="title"
				name="title"
				type="text"
				placeholder="Enter the attraction's name"
			/>
		</div>

		<!-- Price Range -->
		<div>
			<Label for="price">Environmental/Entance Fee &lpar;<i>Optional</i>&rpar;</Label>
			<Input
				class="mt-1 arrow-none"
				id="price"
				name="price"
				type="number"
				min="1"
				placeholder="Enter Environmental/Entance Fee"
			/>
		</div>

		<!-- Evacuation Plan -->
		<div>
			<Label for="description">Description</Label>
			<Textarea
				class="mt-1"
				id="description"
				name="description"
				placeholder="Tell people what makes this place special. Share highlights, unique features, or why they’ll love it..."
			/>
		</div>

		<!-- how to get here -->
		<div>
			<Label for="portDesp">How to Get Here</Label>
			<Textarea
				class="mt-1"
				id="portDesp"
				name="portDesp"
				placeholder="Provide clear directions, landmarks, or transportation details..."
			/>
		</div>

		<!-- Categories -->
		<div>
			<span class="font-semibold">Category</span>

			<div class="relative mt-1 h-full rounded-xl border p-2 pb-4">
				<AttracCategorySelector />
			</div>
		</div>

		<!-- Location -->
		<div>
			<span class="font-semibold">Location</span>

			<div class="relative mt-1 h-full rounded-xl border p-2 pb-4">
				<StepLocation />
			</div>
		</div>

		<div>
			<span class="font-semibold">Contacts & Social Media</span>
			<div class="relative mt-2 h-full rounded-xl border p-2 pb-4">
				<StepContacts forAttraction />
			</div>
		</div>
	</div>
{/snippet}

{#snippet media()}
	<MediaAdder bind:previewUrls />
{/snippet}

<form
	autocomplete="off"
	enctype="multipart/form-data"
	method="POST"
	class="h-full w-full p-8 pb-0"
	use:enhance={handleSubmit}
>
	<Tabs.Root bind:value={currentStep} class="h-full w-full">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="basic">Basic Information</Tabs.Trigger>
			<Tabs.Trigger value="media">Media</Tabs.Trigger>
		</Tabs.List>

		<div class="mt-4 w-full rounded-lg p-4">
			<Tabs.Content value="basic">
				{@render basic()}
			</Tabs.Content>

			<Tabs.Content value="media">
				{@render media()}
			</Tabs.Content>

			<div class="mt-4 flex justify-center">
				<div class="flex w-full">
					{#if currentStep == 'media'}
						<Button
							class="ml-auto"
							variant="outline"
							type="button"
							disabled={isLoading}
							onclick={() => (currentStep = 'basic')}><ArrowLeft />Previous</Button
						>
						<Button type="submit" disabled={isLoading} class="ml-2">
							{#if isLoading}
								<Loader class="animate-spin" />
							{/if}
							Submit
						</Button>
					{:else}
						<Button href="/adm/attractions" class="ml-auto" type="button" variant="destructive">
							Cancel
						</Button>
						<Button class="ml-2" type="button" onclick={() => (currentStep = 'media')}>
							Next <ArrowRight />
						</Button>
					{/if}
				</div>
			</div>
		</div>
	</Tabs.Root>
</form>
