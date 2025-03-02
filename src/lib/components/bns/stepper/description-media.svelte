<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { cn, makeNameAttribute } from '$lib/utils';
	import { Image, Video } from '$lib/components/svg';
	import { CircleX } from 'lucide-svelte';

	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { onMount } from 'svelte';

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

	let currentOpenMediaIndex: number | null = $state(null);
	let selectedFile: File | null = $state(null);
	let previewUrl: Source | null = $state(null);
	let { previewUrls = $bindable([]) }: { previewUrls: Source[] } = $props();

	let sourceLength = $derived(previewUrls.length < 1);

	let desp: string = $state('');
	let cpyrght: string = $state('');
	let isThumbnail: boolean = $state(false);
	let isThumbnailIsDisabled: boolean = $state(false);

	const findMatchSrc = (name: string) => previewUrls.find((source) => source.name === name);

	const [name] = makeNameAttribute('media', { mode: 'objectsInArray' });

	const handleFileChange = (event: Event) => {
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
				selectedFile = file;
				isThumbnailIsDisabled = false;
				previewUrl = { src, type, name: file.name, ...emptyAdditionalValues };
			} else if (file.type.startsWith('video')) {
				type = 'video';
				selectedFile = file;
				isThumbnailIsDisabled = true;
				previewUrl = { src, type, name: file.name, ...emptyAdditionalValues };
			} else {
				// Reset if unsupported file type
				selectedFile = null;
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
			selectedFile = null;
			previewUrl = null;
		}
	};

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

	onMount(() => {
		document.getElementById('formAdd')?.addEventListener('reset', () => {
			currentOpenMediaIndex = null;
			selectedFile = null;
			previewUrl = null;
			desp = '';
			cpyrght = '';
			isThumbnail = false;
			isThumbnailIsDisabled = false;
		});
	});
</script>

<div class="flex h-full w-full justify-center space-x-2 py-10 max-lg:flex-col-reverse">
	<div class="w-full space-y-4 max-lg:mt-8 lg:max-w-[400px]">
		<div>
			<Label for="desp">Description &lpar;Optional&rpar;</Label>
			<Textarea
				class="mt-1"
				id="desp"
				disabled={sourceLength}
				placeholder="Your description"
				bind:value={desp}
				oninput={despOnInput}
			/>
		</div>
		<div>
			<Label for="copyright">Copyright Source/Attribution &lpar;Optional&rpar;</Label>
			<Input
				class="mt-1"
				id="copyright"
				placeholder="https://example.com"
				disabled={sourceLength}
				type="text"
				bind:value={cpyrght}
				oninput={cpyrghtOnInput}
			/>
		</div>
		<div class="flex items-center space-x-2 pt-4">
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
				Set as Thumbnail <i>&lpar;Image Only&rpar;</i>
			</Label>
		</div>
	</div>
	<div class="flex w-auto basis-1/2">
		<div class="aspect-video h-full w-auto flex-1 rounded-3xl bg-background p-4 shadow-lg">
			<!-- svelte-ignore a11y_media_has_caption -->
			{#if previewUrl}
				{#if previewUrl.type == 'image'}
					<img
						src={previewUrl.src}
						alt="Preview of uploaded file"
						class="size-full rounded-2xl object-cover"
					/>
				{:else}
					<video
						src={previewUrl.src}
						class="aspect-video h-full w-full rounded-2xl object-cover"
						controls
					>
					</video>
				{/if}
			{:else}
				<Label
					for="picture"
					class="group/svg flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl border-4 border-dashed"
				>
					<div class="relative mt-5 size-auto">
						<Video
							class="absolute inset-0 size-12 translate-x-4 rotate-12 transition-transform group-hover/svg:translate-x-5 group-hover/svg:rotate-[17deg] md:size-16 md:translate-x-6 md:group-hover/svg:translate-x-8 lg:size-20"
						/>
						<Image
							class="size-12 -translate-x-4 -rotate-12 transition-transform group-hover/svg:-translate-x-5 group-hover/svg:-rotate-[17deg] md:size-16 md:-translate-x-6 md:group-hover/svg:-translate-x-8 lg:size-20"
						/>
					</div>
					<span class="leading-7 md:text-lg lg:text-xl lg:leading-10">Click to add media</span>
				</Label>
			{/if}
		</div>

		<div class="ml-4 flex basis-1/6 flex-col items-center justify-center">
			<div
				class="flex aspect-video w-full max-w-[150px] flex-1 flex-col items-start space-y-1 overflow-x-auto pt-4"
			>
				{#each previewUrls as media, i}
					<div class="relative w-max">
						<button
							type="button"
							class="relative aspect-video w-full max-w-[100px] rounded-lg border-2 p-0.5 {previewUrl?.name ==
							media.name
								? 'border-foreground'
								: 'border-transparent'}"
							onclick={() => galleryOnClick(media, i)}
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

							{@render removeButton(media, i)}
						</button>
						<!-- <button
							class="absolute"
							onclick={() => {
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
							<CircleX class="size-4" />
						</button> -->
					</div>
				{/each}
			</div>

			<Button
				onclick={() => {
					previewUrl = null;
					desp = '';
					cpyrght = '';
					const el = document.getElementById('picture') as HTMLInputElement;
					if (!el) return;
					el.value = '';
					el.click();
				}}
			>
				Add
			</Button>
		</div>
	</div>
</div>
<Input
	id="picture"
	type="file"
	accept="image/png, image/jpeg, image/webp, video/mp4,video/webm,video/ogg"
	class="sr-only inset-0 h-0 w-0"
	onchange={handleFileChange}
/>

{#snippet removeButton(media: Source, i: number)}
	<button
		title="remove"
		class="absolute right-1 top-1 rounded-full bg-background p-0.5 opacity-60 transition-opacity hover:opacity-100"
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
		<CircleX class="size-4 text-red-500" />
	</button>
{/snippet}
