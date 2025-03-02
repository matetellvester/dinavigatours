<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		stepType: 'exist' | 'non-exist';
	}

	let { stepType }: Props = $props();
	let imgs: {
		src: string;
		alt: string;
	}[] = $state([]);

	let current: number = $state(0);

	onMount(() => {
		if (stepType === 'exist') {
			imgs = [
				{
					src: '/images/map-link-steps/exist/exist-step-1.png',
					alt: 'Step 1'
				},
				{
					src: '/images/map-link-steps/exist/exist-step-2.png',
					alt: 'Step 2'
				},
				{
					src: '/images/map-link-steps/exist/exist-step-3.png',
					alt: 'Step 3'
				}
			];
			return;
		}

		imgs = [
			{
				src: '/images/map-link-steps/not-exist/not-exist-step-1.png',
				alt: 'Step 1'
			},
			{
				src: '/images/map-link-steps/not-exist/not-exist-step-2.png',
				alt: 'Step 2'
			},
			{
				src: '/images/map-link-steps/not-exist/not-exist-step-3.png',
				alt: 'Step 3'
			}
		];
	});
</script>

{#if imgs.length > 0}
	<div class="flex flex-col pt-4">
		<div class="pb-4 font-poppins text-xl font-bold">Step {current + 1}</div>
		<div class="flex">
			<img
				class="m-auto aspect-video h-[400px] object-cover shadow-md"
				loading="lazy"
				src={imgs[current].src}
				alt={imgs[current].alt}
			/>
		</div>
		<div class="mx-auto mt-8 flex space-x-3">
			{#each imgs as { src, alt }, i}
				{@const isCurrent = current === i}
				<button
					class="relative flex items-center justify-center ring-2 ring-offset-2 transition-all
          {isCurrent ? 'ring-primary' : 'ring-transparent'}"
					onclick={() => (current = i)}
				>
					<div class="absolute inset-0 flex">
						<span
							class="m-auto flex size-8 items-center justify-center rounded-full bg-background/80 font-poppins text-lg font-bold"
							>{i + 1}</span
						>
					</div>
					<img loading="lazy" {src} {alt} class="aspect-video w-24" />
				</button>
			{/each}
		</div>
	</div>
{/if}
