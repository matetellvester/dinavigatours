<script lang="ts">
	import { getMediaSrc } from '$lib/utils';

	interface Props {
		media: Omit<Media, 'description' | 'copyright_link'>[];
		currentMedia: Omit<Media, 'description' | 'copyright_link'> | null;
	}

	let { media = $bindable(), currentMedia = $bindable(null) }: Props = $props();

	// let currentMedia: Omit<Media, 'description' | 'copyright_link'> | null = $state(media[0]);
</script>

<div class="flex size-full flex-col">
	{#if currentMedia}
		<img
			src={getMediaSrc(currentMedia.src)}
			alt=""
			class="block aspect-video h-3/5 w-full rounded object-cover"
		/>
	{/if}

	<div class="mt-auto flex w-full space-x-4 overflow-x-auto p-1 pb-2">
		{#each media as photo}
			{@const same = currentMedia && currentMedia.src === photo.src}
			<button
				onclick={(e) => {
					e.stopPropagation();
					currentMedia = photo;
				}}
				class="flex-shrink-0 rounded-sm ring
            {same ? 'ring-primary' : 'ring-transparent'} transition-shadow"
			>
				<img
					src={getMediaSrc(photo.src)}
					alt=""
					class="aspect-video max-h-[130px] rounded-sm object-cover"
				/>
			</button>
		{/each}
	</div>
</div>
