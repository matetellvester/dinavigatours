<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
</script>

<section>
	<h2 class="text-lg font-semibold">Contact Information</h2>
	<div class="grid gap-4">
		<!-- Phone Number -->
		<div>
			<Label for="phoneNumber">Phone Number</Label>
			<Input id="phoneNumber" type="tel" name="phoneNumber" placeholder="Enter phone number" />
		</div>

		<!-- Email -->
		<div>
			<Label for="email">Email</Label>
			<Input id="email" type="email" name="email" placeholder="Enter email address" />
		</div>

		<!-- Operating Hours -->
		<div>
			<Label for="operatingHours">Operating Hours</Label>
			<Textarea
				id="operatingHours"
				name="operatingHours"
				placeholder="Example: Mon-Fri: 8:00 AM - 5:00 PM; Sat-Sun: Closed"
			/>
		</div>
	</div>

	<h2 class="mt-6 text-lg font-semibold">Social Media Links</h2>
	<div class="grid gap-4">
		<!-- Facebook -->
		<div>
			<Label for="facebook">Facebook</Label>
			<Input id="facebook" type="url" name="facebook" placeholder="Enter Facebook URL" />
		</div>

		<!-- Optional Other Social Media -->
		<div>
			<Label for="otherSocialMedia">Other Social Media</Label>
			<Input
				id="otherSocialMedia"
				type="url"
				name="otherSocialMedia"
				placeholder="Enter other social media URL"
			/>
		</div>
	</div>
	<div class="mt-6">
		<Label for="additionalDescription">Addition Description</Label>
		<Textarea id="additionalDescription" name="additionalDescription" />
	</div>
</section>

<div class="mt-7 border-l-4 pl-4 font-medium text-muted-foreground">
	<i>
		Before submitting, please ensure that all required fields are filled out correctly to complete
		the process successfully</i
	>
</div>
