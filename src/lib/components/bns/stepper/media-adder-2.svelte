<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Image, Video } from '$lib/components/svg';
	import { ImagePlus, X } from 'lucide-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { fade, scale } from 'svelte/transition';

	interface Source {
		src: string;
		name: string;
		copyright: string;
		desp: string;
		path: string;
		isThumbnail: boolean;
		file: File;
		type: 'image' | 'video';
	}

	let dialogOpen = $state(false);
	let currentOpenMediaIndex: number | null = $state(null);
	let previewUrl: Source | null = $state(null);

	let { previewUrls = $bindable([]) }: { previewUrls: Source[] } = $props();

	let sourceLength = $derived(previewUrls.length < 1);

	let desp: string = $state('');
	let cpyrght: string = $state('');
	let isThumbnail: boolean = $state(false);
	let isThumbnailIsDisabled: boolean = $state(false);

	function findMatchSrc(name: string) {
		return previewUrls.find((source) => source.name === name);
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input?.files?.[0]; // Get the selected file
		let type: 'image' | 'video';

		// Default values
		isThumbnail = false;

		if (file) {
			const path = input.value;

			// Check if the file already exists in the preview list
			const haveMatchSource = findMatchSrc(file.name);
			if (haveMatchSource) {
				previewUrl = haveMatchSource; // If found, just set it
				return;
			}

			// Create a temporary URL for preview
			const src = URL.createObjectURL(file);

			const emptyAdditionalValues = {
				copyright: '',
				desp: '',
				isThumbnail: false,
				path,
				file
			};

			// Determine the file type
			if (file.type.startsWith('image/')) {
				type = 'image';
				// selectedFile = file;
				isThumbnailIsDisabled = false;
				previewUrl = { src, type, name: file.name, ...emptyAdditionalValues };
			} else if (file.type.startsWith('video')) {
				type = 'video';
				// selectedFile = file;
				isThumbnailIsDisabled = true;
				previewUrl = { src, type, name: file.name, ...emptyAdditionalValues };
			} else {
				// Reset if unsupported file type
				// selectedFile = null;
				previewUrl = null;
				return;
			}

			// Add the preview URL to the array
			if (previewUrl) {
				previewUrls.push({ src: previewUrl.src, type, name: file.name, ...emptyAdditionalValues });

				// Update the current open media index
				currentOpenMediaIndex = previewUrls.length - 1;
			}
		} else {
			// Reset when no file is selected
			// selectedFile = null;
			previewUrl = null;
		}
	}

	function galleryOnClick(source: Source, index: number) {
		previewUrl = source;
		currentOpenMediaIndex = index;
		desp = source.desp;
		cpyrght = source.copyright;
		isThumbnail = source.isThumbnail;

		if (previewUrl.type === 'video') {
			isThumbnailIsDisabled = true;
		} else {
			isThumbnailIsDisabled = false;
		}
	}

	function despOnInput() {
		if (currentOpenMediaIndex == null) return;
		previewUrls[currentOpenMediaIndex].desp = desp;
	}

	function cpyrghtOnInput() {
		if (currentOpenMediaIndex == null) return;
		previewUrls[currentOpenMediaIndex].copyright = cpyrght;
	}

	function thumnailOnChange() {
		if (isThumbnail) {
			const lastSetThumbnailIndex = previewUrls.findIndex((v) => v.isThumbnail);
			if (lastSetThumbnailIndex > -1) {
				previewUrls[lastSetThumbnailIndex].isThumbnail = false; // e set ang last na set na thumbnail top false
			}
		}

		if (currentOpenMediaIndex == null) {
			console.error('Dili ma set og true ang thumbinal');
			return;
		}

		previewUrls[currentOpenMediaIndex].isThumbnail = isThumbnail;
	}
</script>

<div class="flex w-full items-center px-12">
	<div class="flex items-center space-x-2">
		<Checkbox
			id="imageThumbnail"
			aria-labelledby="Set thumnail"
			bind:checked={isThumbnail}
			disabled={isThumbnailIsDisabled || sourceLength}
			onCheckedChange={thumnailOnChange}
		/>
		<Label
			for="imageThumbnail"
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			Set this as thumbnail <i>&lpar;Image Only&rpar;</i>
		</Label>
	</div>

	<div class="ml-auto inline-block">
		<Button
			size="sm"
			type="button"
			variant="outline"
			onclick={() => (dialogOpen = true)}
			disabled={isThumbnailIsDisabled || sourceLength}>Add/edit details</Button
		>
	</div>
</div>

<div class="mt-4 flex">
	{@render empty()}

	{@render notEmpty()}
</div>

<div class="relative">
	{#if previewUrls.length > 0}
		<div
			transition:fade={{ duration: 150 }}
			class="mx-auto mt-4 block w-[36rem] overflow-auto text-nowrap"
		>
			<label
				title="Add new media"
				for="picture"
				class="absolute left-10 top-4 z-10 flex h-16 w-16 cursor-pointer rounded-md border bg-background px-4"
			>
				<ImagePlus class="m-auto" />
			</label>
			<div class="flex h-24 w-full space-x-2 p-4 pl-20">
				{#each previewUrls as media, index}
					{@render previewMedia(media, index)}
				{/each}
			</div>
		</div>
	{/if}
</div>

{#snippet empty()}
	{#if !previewUrl}
		<Label
			for="picture"
			class="group/svg mx-auto flex aspect-video  h-full max-w-xl grow cursor-pointer flex-col items-center justify-center rounded-2xl border-4 border-dashed"
		>
			<div class="relative mt-5 size-auto">
				<Video
					class="absolute inset-0 size-12 translate-x-4 rotate-12 transition-transform group-hover/svg:translate-x-5 group-hover/svg:rotate-[17deg] md:size-16 md:translate-x-6 md:group-hover/svg:translate-x-8 lg:size-20"
				/>
				<Image
					class="size-12 -translate-x-4 -rotate-12 transition-transform group-hover/svg:-translate-x-5 group-hover/svg:-rotate-[17deg] md:size-16 md:-translate-x-6 md:group-hover/svg:-translate-x-8 lg:size-20"
				/>
			</div>
			<span class="leading-7 md:text-lg lg:text-xl lg:leading-10">Click here to add media</span>
		</Label>
	{/if}
{/snippet}

{#snippet notEmpty()}
	{#if previewUrl}
		<div class="mx-auto aspect-video w-full max-w-xl rounded-2xl shadow-lg">
			{#if previewUrl.type == 'image'}
				<img
					src={previewUrl.src}
					alt="Preview of uploaded file"
					class="size-full rounded-2xl object-cover"
				/>
			{:else}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video
					src={previewUrl.src}
					class="aspect-video h-full w-full rounded-2xl object-cover"
					controls
				>
				</video>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet previewMedia(media: Source, index: number)}
	<div
		class="relative aspect-video h-full rounded-md border bg-gray-100"
		transition:scale={{ duration: 150 }}
	>
		<button
			type="button"
			class="group/removeBtn relative aspect-video size-full rounded-md ring transition-shadow
      {previewUrl?.name == media.name ? 'ring-primary' : 'ring-transparent'}"
			onclick={() => galleryOnClick(media, index)}
		>
			{#if media.type === 'image'}
				<img
					src={media.src}
					alt="Preview of uploaded file"
					class="aspect-video size-full rounded-md object-cover shadow"
				/>
			{:else}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video src={media.src} class="aspect-video size-full rounded-md object-cover shadow"
				></video>
			{/if}

			{@render removeButton(media, index)}
		</button>
	</div>
{/snippet}

{#snippet removeButton(media: Source, i: number)}
	<button
		title="remove this media"
		type="button"
		class="absolute right-0 top-0 rounded-bl-xl rounded-tr-sm border-b border-l bg-background p-1 shadow-lg transition-opacity"
		onclick={(e) => {
			e.stopPropagation();
			if (previewUrl?.src === media.src) {
				previewUrl = null;
				desp = '';
				cpyrght = '';
			}

			if (media.isThumbnail) {
				isThumbnail = false;
			}
			previewUrls.splice(i, 1);
			const el = document.getElementById('picture') as HTMLInputElement;
			if (el) {
				el.value = '';
			}
		}}
	>
		<X class="size-3 transition-all hover:text-red-500 group-hover/removeBtn:size-4" />
	</button>
{/snippet}

<Input
	id="picture"
	type="file"
	accept="image/png, image/jpeg, image/webp, video/mp4,video/webm,video/ogg"
	class="sr-only inset-0 h-0 w-0"
	onchange={handleFileChange}
/>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Media Details</Dialog.Title>
			<Dialog.Description>
				Provide a description and copyright information for this photo/video. These details help
				ensure proper attribution and enhance content accessibility
			</Dialog.Description>
		</Dialog.Header>
		<div>
			<Label for="desp">Description &lpar;Optional&rpar;</Label>
			<Textarea
				class="col-span-3 mb-4 mt-2"
				id="desp"
				disabled={sourceLength}
				placeholder="Media description"
				bind:value={desp}
				oninput={despOnInput}
			/>

			<Label for="copyright">Copyright Source/Attribution &lpar;Optional&rpar;</Label>
			<Input
				autocomplete="off"
				class="col-span-3 mt-2"
				id="copyright"
				placeholder="https://example.com"
				disabled={sourceLength}
				type="text"
				bind:value={cpyrght}
				oninput={cpyrghtOnInput}
			/>
		</div>
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'default' })}>Close and Save</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
