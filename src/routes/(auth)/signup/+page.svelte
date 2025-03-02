<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Loader } from 'lucide-svelte';
	import { Eye, EyeOff, ArrowLeft } from 'lucide-svelte';
	import UserRole from './user-role.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils.js';
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types.js';
	import ValidId from '$lib/components/valid-id.svelte';

	interface Props {
		class?: string | undefined | null;
		form: ActionData;
		[key: string]: any;
	}

	let { class: className = undefined, form }: Props = $props();

	let isLoading = $state(false);
	let showPass = $state(true);
	// let email = $state(form?.email ?? '');
	let password = $state('');
	let role = $state('2');

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		return async ({ update }) => {
			update();
			isLoading = false;
		};
	};
	// import type { PageData } from './$types';
</script>

<svelte:head>
	<title>Create Account</title>
</svelte:head>

<div class="flex h-dvh items-center">
	<div class="flex h-full w-full flex-col justify-center p-2 sm:p-4">
		<Card.Root class="mx-auto w-full max-w-md max-sm:border-none max-sm:shadow-none">
			<Card.Header>
				<Card.Title class="text-2xl">Sign up</Card.Title>
				<Card.Description>Enter your information to create an account</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class={cn('grid gap-6', className)}>
					<form method="POST" autocomplete="on" use:enhance={handleSubmit}>
						<div class="mb-2 grid gap-5">
							<div class="grid gap-2">
								<div>
									<Label for="email">Email</Label>
									<Input
										id="email"
										placeholder="Enter email"
										type="email"
										name="email"
										required
										autocapitalize="none"
										autocomplete="email"
										autocorrect="off"
										disabled={isLoading}
									/>
								</div>
								<div>
									<Label for="password">Password</Label>
									<div class="relative">
										<Input
											id="password"
											name="password"
											placeholder="Enter password"
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
									</div>
								</div>

								<div class="grid gap-2 md:grid-cols-2">
									<div>
										<Label for="firstname">First Name</Label>
										<Input
											id="firstname"
											type="text"
											name="firstname"
											required
											autocapitalize="words"
											autocomplete="off"
											autocorrect="off"
											placeholder="Juan"
											disabled={isLoading}
										/>
									</div>
									<div>
										<Label for="lastname">Last Name</Label>
										<Input
											id="lastname"
											type="text"
											name="lastname"
											required
											autocapitalize="words"
											autocomplete="off"
											autocorrect="off"
											placeholder="Dela Cruz"
											disabled={isLoading}
										/>
									</div>
								</div>

								<div>
									<ValidId />
								</div>

								<div>
									<label for="role" class="sr-only">
										<input tabindex="-1" bind:value={role} type="text" name="role" id="role" />
									</label>
									<UserRole disabled={isLoading} bind:value={role} />
								</div>
							</div>
							<Button type="submit" disabled={isLoading}>
								{#if isLoading}
									<Loader class="animate-spin" />
									<span>Signing up...</span>
								{:else}
									<span>Signup</span>
								{/if}
							</Button>
							<div class="mt-4 text-center text-sm">
								Already have an account?
								<a href="/login" class="underline"> Log in </a>
							</div>
						</div>
					</form>
				</div>
			</Card.Content>
		</Card.Root>

		<div class="mx-auto mt-2 w-full max-w-md">
			<Button variant="ghost" href="/" class="group/back">
				<ArrowLeft class="transition-transform group-active/back:-translate-x-1" />
				<span>Back to home</span>
			</Button>
		</div>
	</div>
</div>
