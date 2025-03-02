<script lang="ts">
	import type { PageData } from './$types';
	import { admHeader } from '$adm-route/admin.svelte';
	import { onMount } from 'svelte';

	import Vessel from './vessel.svelte';

	let { data }: { data: PageData } = $props();

	type VesselType = {
		name: string;
		value: string;
	};

	export const VESSELS: VesselType[] = [
		{ name: 'Loreto', value: 'loreto' },
		{ name: 'Tubajon', value: 'tubajon' },
		{ name: 'Libjo', value: 'libjo' },
		{ name: 'Basilisa', value: 'basilisa' },
		{ name: 'San Jose', value: 'sanjose' },
		{ name: 'Cagdianao', value: 'cagdiano' },
		{ name: 'Dinagat', value: 'dinagat' }
	];

	onMount(() => {
		admHeader.v = 'Vessels';
	});
</script>

<svelte:head>
	<title>Users | Vessels</title>
</svelte:head>

{#each VESSELS as vessel}
	<Vessel s={data.supabase} v={vessel} />
{/each}
