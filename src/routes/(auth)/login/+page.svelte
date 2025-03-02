<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Eye, EyeOff, ArrowLeft } from 'lucide-svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Loader } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import { X } from 'lucide-svelte';

	let isLoading = $state(false);
	let showPass = $state(false);
	let password = $state('');

	let { form } = $props();

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		return async ({ update, result }) => {
			update();

			// @ts-ignore
			if (result.type == 'failure' && result.data.error.includes('Invalid Credentials')) {
				toast.error('Invalid Credentials');
			}

			isLoading = false;
		};
	};

	// $effect(() => {
	// 	if (form && !form.success) {
	// 		toast.info(String(form.error));
	// 	}
	// });

	let message: string | undefined = $state(undefined);

	$effect(() => {
		message = $page.url.searchParams.get('message') ?? undefined;
	});
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="flex h-dvh flex-col items-center max-sm:mt-10 sm:justify-center">
	<div class="max-sm:w-full max-sm:px-4">
		{#if message}
			<p id="message-notif" class="relative mb-1 rounded-md bg-yellow-400/30 px-3 py-2 text-sm">
				<button
					onclick={() => {
						const element = document.getElementById('message-notif') as HTMLElement;
						if (element) {
							element.style.display = 'none';
						}
					}}
					class="absolute -right-1 -top-2 rounded-full bg-muted p-1 text-foreground"
					><X class="size-3" /></button
				>
				{message}
			</p>
		{/if}

		<Card.Root class="mx-auto max-w-sm  max-sm:border-none max-sm:shadow-none">
			<Card.Header>
				<Card.Title class="text-2xl">
					<h1>Login</h1>
				</Card.Title>
				<Card.Description>Enter your email below to login to your account</Card.Description>
			</Card.Header>
			<Card.Content>
				<form method="POST" use:enhance={handleSubmit}>
					<div class="grid gap-4">
						<div class="grid gap-2">
							<Label for="email" class="sr-only">Email</Label>
							<Input id="email" type="email" name="email" placeholder="Email Address" required />
						</div>
						<div class="grid gap-2">
							<!-- <div class="flex items-center"> -->
							<Label for="password" class="sr-only">Password</Label>
							<!-- </div> -->

							<div class="relative">
								<Input
									id="password"
									name="password"
									placeholder="Password"
									type={showPass ? 'text' : 'password'}
									autocapitalize="none"
									autocorrect="off"
									autocomplete="off"
									required
									disabled={isLoading}
									bind:value={password}
									class="pr-9"
								/>
								{#if password.trim()}
									<Button
										onclick={() => (showPass = !showPass)}
										size="icon"
										variant="link"
										disabled={isLoading}
										class="absolute right-0 top-0 p-0"
									>
										{#if showPass}
											<EyeOff />
										{:else}
											<Eye />
										{/if}
									</Button>
								{/if}

								<a href="##" class="mt-2 inline-block text-sm text-primary hover:underline">
									Forgot your password?
								</a>
							</div>
						</div>
						<Button type="submit" disabled={isLoading}>
							{#if isLoading}
								<Loader class="animate-spin" />
								<span>Logging in...</span>
							{:else}
								<span>Login</span>
							{/if}
						</Button>
						<!-- <Button variant="outline" class="w-full">Login with Google</Button> -->
					</div>
				</form>
				<div class="mt-4 text-center text-sm">
					Don't have an account?
					<a href="/signup" class="underline"> Sign up </a>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
	<div class="mx-auto mt-2 w-full max-w-sm px-4">
		<Button variant="ghost" class="group/back" onclick={() => window.history.back()}>
			<ArrowLeft class="transition-transform group-active/back:-translate-x-1" />
			<span>Go back</span>
		</Button>
	</div>
</div>
