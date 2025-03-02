<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end';

	import Favicon from './svg/favicon.svelte';

	let { versions, defaultVersion }: { versions: string[]; defaultVersion: string } = $props();

	let selectedVersion = $state(defaultVersion);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<div class="flex items-end">
			<Favicon class="size-16 dark:invert" />
		</div>
	</Sidebar.MenuItem>
</Sidebar.Menu>
