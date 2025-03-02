<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { Label } from '$lib/components/ui/label';

	interface Props {
		disabled: boolean;
		value: string;
	}

	const roles = [
		{
			value: '3',
			label: 'Tourist'
		},
		{
			value: '2',
			label: 'Business Owner'
		}
	];

	let { value = $bindable('2'), disabled }: Props = $props();

	const triggerContent = $derived(roles.find((f) => f.value === value)?.label ?? 'Select a fruit');
</script>

<Label for="userType">User type</Label>
<Select.Root type="single" name="favoriteFruit" bind:value>
	<Select.Trigger id="userType">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each roles as role}
				<Select.Item value={role.value} label={role.label}>{role.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
