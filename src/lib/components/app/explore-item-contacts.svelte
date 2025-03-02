<script lang="ts">
	import { Phone, Mail, Contact } from 'lucide-svelte';

	interface Props {
		contacts:
			| {
					name: string;
					label: string;
					link: string;
			  }[]
			| null;
	}

	let { contacts }: Props = $props();
</script>

{#if contacts}
	<div class="mt-6 flex items-center">
		<span class="h-6 w-2 rounded-full bg-primary"></span>
		<h1 class="px-4 py-2 text-xl font-bold text-foreground">Contact Information & Social Media</h1>
	</div>

	<div class="flex flex-col">
		{#each contacts as contact}
			{#if contact.link.trim()}
				<div class="flex items-center space-x-2 px-4 py-2">
					{#if contact.name === 'name'}
						<Contact class="mr-1 size-6" />
					{/if}
					{#if contact.name === 'phone'}
						<Phone class="mr-1 size-6" />
					{/if}
					{#if contact.name === 'email'}
						<Mail class="mr-1 size-6" />
					{/if}
					{#if contact.name === 'facebook'}
						{@render facebook()}
					{/if}
					{#if contact.name === 'instagram'}
						{@render instagram()}
					{/if}
					{#if contact.name === 'twitter'}
						{@render twitter()}
					{/if}

					{#if contact.name !== 'phone' && contact.name !== 'email' && contact.name !== 'name'}
						<a href={contact.link} class="text-primary underline">{contact.label}</a>
					{:else}
						<span>{contact.link}</span>
						{#if contact.name == 'name'}
							<span class="italic">&lpar;Owner name&rpar;</span>
						{/if}
					{/if}
				</div>
			{/if}
		{/each}
	</div>
{/if}

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
		class="lucide lucide-facebook size-6"
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
		class="lucide lucide-facebook size-6"
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
		class="lucide lucide-facebook size-6"
		><path
			d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
		/></svg
	>
{/snippet}
