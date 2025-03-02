<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';
	import Cash from '../svg/cash.svelte';
	import { onMount } from 'svelte';

	type ContactInfo = {
		label: string;
		value: string;
	};

	type DataItem = {
		contactInfos: ContactInfo[] | null;
	};

	let contacts: ContactInfo[] = $state([]);

	function extractContacts(data: DataItem[]): ContactInfo[] {
		return data.flatMap((item) => item.contactInfos || []); // Flatten and filter out null values
	}

	onMount(async () => {
		const res = await fetch('adm/settings');

		if (!res.ok) {
			console.error('Failed to fetch settings');
		}
		contacts = extractContacts(await res.json());
	});
</script>

<footer class="border-t py-6">
	<div class="container mx-auto grid gap-6 max-md:divide-y sm:grid-cols-2 lg:grid-cols-3">
		<!-- Contact Information -->
		<div>
			<h3 class="text-lg font-medium">Contact Us</h3>
			<ul class="mt-2 space-y-1 text-sm">
				<li>Phone: +63 912 345 6789</li>
				<li>Email: support@dinavigatours.com</li>
				<li>
					Facebook: <a href="/" class="text-blue-500 underline">facebook.com/dinavigatours</a>
				</li>
			</ul>
		</div>

		<!-- Secondary Links -->
		<div class="max-md:pt-4">
			<h3 class="text-lg font-medium">Quick Links</h3>
			<ul class="mt-2 space-y-1 text-sm">
				<li><a href="/" class="hover:underline">Privacy Policy</a></li>
				<li><a href="/" class="hover:underline">Terms of Service</a></li>
				<li><a href="/" class="hover:underline">FAQs</a></li>
			</ul>
		</div>

		<!-- Payment Methods -->
		<div class="max-md:pt-4">
			<h3 class="text-lg font-medium">Payment Methods</h3>
			<div class="flex items-center space-x-4">
				<!-- GCash -->
				<div class="flex items-center space-x-2">
					<img src="/gcash.png" alt="GCash Logo" class="h-8" />

					<!-- <img
						src="https://scontent.fceb1-1.fna.fbcdn.net/v/t39.30808-6/333062832_1724480238024946_4201921315994746782_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=c8LLrl7uA3YQ7kNvgGRQY2a&_nc_zt=23&_nc_ht=scontent.fceb1-1.fna&_nc_gid=AnG1zr1aNAx-nVbxuEwbXtT&oh=00_AYBpW88erEnKvevdsapnaUR-u94XYJUo5paDot85AXiGtA&oe=674B4EF4"
						alt="PTCO logo"
						class="h-8"
					/> -->
					<span class="text-sm">GCash</span>
				</div>
				<!-- Cash -->
				<div class="flex items-center space-x-2">
					<Cash class="size-9" />
					<span class="text-sm">Cash on hand</span>
				</div>
			</div>
		</div>

		<!-- Partners -->
		<div class="max-md:pt-4">
			<h3 class="text-lg font-medium">Our Partners</h3>
			<div class="flex items-center space-x-4">
				<!-- PTCO -->
				<div class="flex items-center space-x-2">
					<img src="ptco.jpg" alt="PTCO logo" class="h-8 rounded-md" />
					<a target="_blank" class="text-blue-500 underline" href="https://www.facebook.com/PDITC"
						>Dinagat Islands - Tourism and Culture Office</a
					>
				</div>
			</div>
		</div>

		<div class="max-md:pt-4 md:col-span-2">
			<h3 class="text-lg font-medium">Emergency Contact</h3>
			<div class="flex items-center space-x-4">
				<!-- PTCO -->
				<div class="flex flex-col items-start space-y-1 text-sm">
					{#each contacts as contact}
						<div class="flex">
							<p>{contact.label}: {contact.value}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<div class="mt-6 border-t pt-4 text-center text-sm text-muted-foreground">
		© 2024 Dinavigatours. All rights reserved.
	</div>
</footer>
