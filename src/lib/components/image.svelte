<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Image as Fallback } from './svg';
	let { src, alt }: { src: string; alt: string } = $props();
</script>

<Avatar.Root class="size-full rounded-none">
	<Avatar.Image class="aspect-[auto] size-auto" {src} {alt} />
	<Avatar.Fallback>
		<img src="/fallback_broken_image_link.png" class="size-auto" alt="the fallback" />
	</Avatar.Fallback>
</Avatar.Root>
