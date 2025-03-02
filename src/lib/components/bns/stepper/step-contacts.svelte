<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Phone, Mail, Contact } from 'lucide-svelte';

	interface Props {
		/**
		 * Kung true ni, ang placeholder sa name is `Owner Name` else `Complete name`
		 */
		forAttraction?: boolean;
	}

	let { forAttraction }: Props = $props();

	const nameAttr = (index: number, name: string) => {
		return `social_media[${index}].[${name}]`;
	};
</script>

<h2 class="mb-2 mt-4 px-4 text-lg">Personal</h2>
<div class="flex items-center space-x-2 px-4 py-2">
	<Contact class="mr-1 size-4" />
	<input type="hidden" name={nameAttr(0, 'name')} value="name" />
	<input type="hidden" name={nameAttr(0, 'label')} value="" />
	<Input name={nameAttr(0, 'link')} placeholder={forAttraction ? 'Owner Name' : 'Complete Name'} />
</div>

<h2 class="mb-2 mt-4 px-4 text-lg">Contacts</h2>
<div class="flex items-center space-x-2 px-4 py-2">
	<Phone class="mr-1 size-4" />
	<input type="hidden" name={nameAttr(0, 'name')} value="phone" />
	<input type="hidden" name={nameAttr(0, 'label')} value="" />
	<Input name={nameAttr(0, 'link')} placeholder="Phone Number" />
</div>

<div class="flex items-center space-x-2 px-4 py-2">
	<Mail class="mr-1 size-4" />
	<input type="hidden" name={nameAttr(1, 'name')} value="email" />
	<input type="hidden" name={nameAttr(1, 'label')} value="" />
	<Input name={nameAttr(1, 'link')} placeholder="Email Address" />
</div>

<h2 class="mb-2 mt-4 px-4 text-lg">Social Media</h2>

<div class="flex items-center space-x-2 px-4 py-2">
	{@render facebook()}
	<input type="hidden" name={nameAttr(2, 'name')} value="facebook" />
	<Input name={nameAttr(2, 'label')} placeholder="Username" />
	<Input name={nameAttr(2, 'link')} placeholder="Link" />
</div>

<div class="flex items-center space-x-2 px-4 py-2">
	{@render instagram()}
	<input type="hidden" name={nameAttr(3, 'name')} value="instagram" />
	<Input name={nameAttr(3, 'label')} placeholder="Username" />
	<Input name={nameAttr(3, 'link')} placeholder="Link" />
</div>

<div class="flex items-center space-x-2 px-4 py-2">
	{@render twitter()}
	<input type="hidden" name={nameAttr(4, 'name')} value="twitter" />
	<Input name={nameAttr(4, 'label')} placeholder="Username" />
	<Input name={nameAttr(4, 'link')} placeholder="Link" />
</div>

{#snippet facebook()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-facebook size-10"
		><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg
	>
{/snippet}

{#snippet instagram()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-facebook size-10"
		><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path
			d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
		/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg
	>
{/snippet}

{#snippet twitter()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-facebook size-10"
		><path
			d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
		/></svg
	>
{/snippet}
