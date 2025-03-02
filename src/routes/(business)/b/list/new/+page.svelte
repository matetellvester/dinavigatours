<script lang="ts">
	import { FileText, Images, HandHelping, MoveLeft, MoveRight, Loader } from 'lucide-svelte';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Button } from '$lib/components/ui/button';
	import StepBasicInfo from '$bns-comps/stepper/step-basic-info.svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { makeNameAttribute } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import { rooms } from '$bns-route/b/list/new/index.svelte';

	let currentStep = $state(25); // Tracks the current active step

	let maxPrice = $derived(Math.max(...rooms.val.map((room) => parseFloat(room.info.price))) || 0);

	type Step = {
		key: number;
		name: string;
		icon: any;
	};

	const steps: Step[] = [
		{ key: 25, name: 'Basic Information', icon: FileText },
		{ key: 50, name: 'Services & Pricing', icon: HandHelping },
		{ key: 75, name: 'Description & Media', icon: Images }
	];

	let isLoading = $state(false);

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
				toast.success('Added Successfully, redirecting please wait...');
				rooms.val = [];
				await goto('/b/list');
			}
			isLoading = false;
		};
	};
</script>

{#snippet line(based: number = 0)}
	<Progress
		value={based < currentStep ? 100 : 0}
		class="h-0.5 rounded-none [&>div]:bg-foreground"
	/>
{/snippet}

{#snippet step(current: boolean | null = null, step: Step)}
	<div class="relative flex items-center {current == null ? 'text-muted-foreground' : ''}">
		<div
			class="h-12 w-12 rounded-full border-2 py-3 transition duration-500 ease-in-out
      {current == true
				? ' border-foreground bg-foreground text-background'
				: current == null
					? ''
					: 'border-foreground bg-background'}"
		>
			<step.icon class="size-full"></step.icon>
		</div>
		<span class="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase">
			{step.name}
		</span>
	</div>
{/snippet}

<div class="relative flex min-h-dvh flex-col px-10">
	<div class="mx-4 px-10 py-4">
		<div class="mx-auto flex max-w-5xl items-center">
			{#each steps as stepName, i}
				{@const current =
					currentStep == stepName.key ? true : currentStep > stepName.key ? false : null}
				{@render step(current, stepName)}

				{#if steps.length - 1 !== i}
					{@render line(stepName.key)}
				{/if}
			{/each}
		</div>
	</div>
	<form
		id="formAdd"
		method="POST"
		use:enhance={handleSubmit}
		autocomplete="off"
		enctype="multipart/form-data"
		class="flex h-full flex-1 flex-col pb-12"
	>
		<div class="mt-8 flex h-full flex-1 flex-col p-4">
			<div class="flex h-full flex-1">
				<div class="{currentStep == 25 ? 'flex-1' : 'hidden'} mx-auto max-w-5xl">
					<StepBasicInfo />
				</div>
				<div class="{currentStep == 50 ? 'flex-1' : 'hidden'} ">
					<!-- <StepServices /> -->

					{#await import('$bns-comps/stepper/step-services.svelte') then Comp}
						<Comp.default />
					{/await}
				</div>
				<div class="{currentStep == 75 ? 'flex-1' : 'hidden'} mx-auto max-w-5xl">
					<!-- <DescriptionMedia bind:previewUrls /> -->

					{#await import('$bns-comps/stepper/description-media.svelte') then Comp}
						<Comp.default bind:previewUrls />
					{/await}
				</div>
				<div class={currentStep == 100 ? 'flex-1' : 'hidden'}>
					<!-- <StepAdditional /> -->
				</div>
			</div>
		</div>
		<div
			class="fixed bottom-0 left-0 right-0 flex w-full space-x-2 border-t bg-background py-2 pr-4"
		>
			<Button
				href="/b/list"
				type="button"
				variant="outline"
				class="ml-4 mr-auto"
				onclick={() => {
					if (currentStep <= 25) return;
					currentStep = currentStep - 25;
				}}
			>
				Cancel</Button
			>
			<Button
				class="ml-auto"
				type="button"
				variant="outline"
				disabled={currentStep === 25}
				onclick={() => {
					if (currentStep <= 25) return;
					currentStep = currentStep - 25;
				}}
			>
				<MoveLeft />
				Previous</Button
			>
			{#if currentStep == 75}
				<Button type="submit" disabled={isLoading}>
					{#if isLoading}
						<Loader class="animate-spin" />
					{/if}
					Submit
				</Button>
			{:else}
				<Button
					type="button"
					onclick={() => {
						if (currentStep >= 75) return;
						currentStep = currentStep + 25;
					}}
				>
					Next <MoveRight />
				</Button>
			{/if}
		</div>
		{#each rooms.val as r, i}
			<input type="hidden" name="room[{i}][info][name]" value={r.info.name} />
			<input type="hidden" name="room[{i}][info][type]" value={r.info.type} />
			<input type="hidden" name="room[{i}][info][capacity]" value={r.info.capacity} />
			<input type="hidden" name="room[{i}][info][price]" value={r.info.price} />

			{#each Object.entries(r.beds) as [key, value], j}
				{#if value}
					<input type="hidden" name="room[{i}][beds][{j}]" value={key} />
				{/if}
			{/each}

			{#each r.amenities as a, j}
				<input type="hidden" name="room[{i}][amenities][{j}]" value={a} />
			{/each}
		{/each}
		{#if rooms.val.length}
			<input type="hidden" name="rate" value={maxPrice} />
		{/if}
	</form>
</div>
