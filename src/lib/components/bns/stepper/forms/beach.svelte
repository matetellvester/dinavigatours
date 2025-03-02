<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { makeNameAttribute } from '$lib/utils';
	import { type AllSubCategories } from './types';
	import GeneralInputs from '../general-inputs.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Select from '$lib/components/ui/select/index.js';
	import { makeFormNameAttribute } from '.';
	import { Textarea } from '$lib/components/ui/textarea';
	import GroupOptionSelector from '../group-option-selector.svelte';
	const type: AllSubCategories = 'Beach';

	const name = makeFormNameAttribute('Beach');

	const accoTypes = [
		{ value: 'cottage', label: 'Cottage' },
		{ value: 'room', label: 'Room' },
		{ value: 'cottageAndRoom', label: 'Cottage & Room' }
	];

	let value = $state('');
	let overnightStay = $state(false);

	const triggerContent = $derived(
		accoTypes.find((f) => f.value === value)?.label ?? 'Select accommodation type'
	);
</script>

<div class="rounded-xl border bg-muted/10 p-4">
	<GroupOptionSelector />
</div>
