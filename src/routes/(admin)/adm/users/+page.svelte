<script lang="ts">
	import type { PageData } from './$types';
	import DataTable from '$lib/components/admin/data-table.svelte';
	import { adminUsersTableColumns as columns } from '$lib/components/admin/admin-table-columns';
	import { onMount } from 'svelte';
	import { admHeader } from '$adm-route/admin.svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		admHeader.v = 'Users';
	});
</script>

<svelte:head>
	<title>Users | Admin</title>
</svelte:head>
<DataTable data={data.users} {columns} />
