<script lang="ts">
	import MapSteps from '$lib/components/map-link-steps/map-steps.svelte';
	import RadioSelector from '$lib/components/radio-selector.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { MUNICIPALITIES, MUNICIPALITY_OBJS } from '$lib/constants';
	import { getIframeLink } from '$lib/utils';
	import { CircleHelp, MoveLeft } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		onDone?: (done: boolean) => void;
		plainNameAttribute?: boolean;
		optionalMapLink?: boolean;
		initial?: {
			municipality: string;
			baranggay: string;
			purok: string;
			mapLink: string;
		};
	}

	let { onDone, plainNameAttribute, optionalMapLink, initial }: Props = $props();

	let bgrys: readonly string[] | null = $state(null);

	let openMapLinkStep = $state(false);
	let selectedMunicipal = $state('');
	let selectedBgry = $state('');
	let selectedPurok = $state('');
	let mapLink = $state('');

	let currentOpen: 'municipality' | 'baranggay' | 'purok' = $state('municipality');

	function getBgrys(municapal: string) {
		selectedMunicipal = municapal;

		const objKey = (municapal.replaceAll(' ', '').toUpperCase() +
			'_OBJ') as keyof typeof MUNICIPALITY_OBJS;

		bgrys = MUNICIPALITY_OBJS[objKey].map((b) => b.name) as readonly string[];
		currentOpen = 'baranggay';
	}

	function handleMapLinkChange(event: Event) {
		const target = event.target as HTMLTextAreaElement; // Type assertion

		let iframeCode: string = '';
		iframeCode = target.value;

		const link = getIframeLink(iframeCode);
		if (!link) return;

		mapLink = link;
	}
	$effect(() => {
		onDone?.(
			[selectedMunicipal, selectedBgry, mapLink].every((field) => field.trim() !== '') &&
				selectedPurok != null
		);
	});

	onMount(() => {
		if (initial) {
			// console.log(initial);

			selectedMunicipal = initial.municipality;
			getBgrys(initial.municipality);
			selectedBgry = initial.baranggay;
			selectedPurok = initial.purok;
			mapLink = initial.mapLink;

			currentOpen = 'purok';
		}
	});
</script>

<input
	type="hidden"
	name={plainNameAttribute ? 'municipality' : 'location[municipality]'}
	bind:value={selectedMunicipal}
	aria-label="selected municipality"
/>
<input
	type="hidden"
	name={plainNameAttribute ? 'baranggay' : 'location[baranggay]'}
	bind:value={selectedBgry}
	aria-label="selected baranggay"
/>
<input
	type="hidden"
	name={plainNameAttribute ? 'purok' : 'location[purok]'}
	bind:value={selectedPurok}
	aria-label="selected purok"
/>
<input
	type="hidden"
	aria-label="map link"
	name={plainNameAttribute ? 'map_link' : 'location[map_link]'}
	bind:value={mapLink}
/>

<h1 class="bg-background p-1 text-2xl capitalize">
	{#if !selectedMunicipal || !selectedBgry}
		Select {currentOpen}
	{:else}
		Enter purok
	{/if}
</h1>

{#if currentOpen == 'municipality'}
	<div in:fade>
		<RadioSelector choices={MUNICIPALITIES} onChange={(val) => getBgrys(val)} />
	</div>
{/if}

{#if currentOpen == 'baranggay' && !selectedBgry}
	<div in:fade>
		<Button
			variant="ghost"
			class="mb-4"
			onclick={() => {
				currentOpen = 'municipality';
				selectedBgry = '';
				selectedMunicipal = '';
				bgrys = null;
			}}><MoveLeft />Municipality</Button
		>

		<RadioSelector
			choices={bgrys as readonly string[]}
			onChange={(val) => {
				selectedBgry = val;
				currentOpen = 'purok';
			}}
		/>
	</div>
{/if}

{#if currentOpen == 'purok'}
	<div in:fade>
		<Button
			variant="ghost"
			class="mb-4"
			onclick={() => {
				currentOpen = 'baranggay';
				selectedBgry = '';
			}}><MoveLeft />Baranggay</Button
		>

		<div class="p-1">
			<Input
				type="number"
				min="1"
				max="7"
				placeholder="Purok (Optional)"
				bind:value={selectedPurok}
			/>
		</div>
		<div class="mt-2 flex space-x-2">
			{#each Array.from({ length: 7 }, (_, i) => i + 1) as num}
				<Button
					type="button"
					size="sm"
					variant="outline"
					class="size-8 rounded-full"
					onclick={() => {
						selectedPurok = num.toString();
					}}
				>
					{num}
				</Button>
			{/each}
		</div>

		<div class="mt-4 p-1">
			<Label for="businessMapLink">
				<div class="flex items-center space-x-2">
					<span> Map embed location </span>
					<button
						class="item-center flex space-x-2 rounded border px-2 py-1 text-muted-foreground"
						onclick={() => (openMapLinkStep = true)}
						><CircleHelp class="size-4" />
						<span> How to add</span>
					</button>
				</div>
				{#if optionalMapLink}
					<i class="text-muted-foreground">&lpar;Optional&rpar;</i>
				{/if}
			</Label>

			<Textarea
				class="mt-1"
				oninput={handleMapLinkChange}
				id="businessMapLink"
				placeholder="e.g, <iframe src='https://www.google.com/maps/embed?pb=somelink'></iframe>"
			/>
		</div>
	</div>
{/if}

<MapSteps bind:open={openMapLinkStep} />
