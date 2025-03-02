<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils.js';
	import { Loader, Send } from 'lucide-svelte';
	import type { PageData, SubmitFunction } from './$types.js';

	interface Props {
		class?: string | undefined | null;
		data: PageData;
		[key: string]: any;
	}

	let { class: className = undefined, data, ...rest }: Props = $props();

	let isLoading = $state(false);
	let value = $state('');

	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		return async ({ update }) => {
			update();
			isLoading = false;
		};
	};
</script>

<svelte:head>
	<title>Verify Sign Up</title>
</svelte:head>

<div class="flex h-dvh items-center justify-center">
	<Card.Root class="mx-auto max-w-sm">
		<Card.Header>
			<Card.Title class="text-center text-2xl">
				<Send class="m-auto mb-4" size="50" />

				<span>Verify Email</span>
			</Card.Title>
			<Card.Description class="text-center">
				<!-- A verification code has been sent to
				<span class="block">{data.email}</span> -->

				A verification code has been sent to <span class="block">{data.email}</span> by Supabase on behalf
				of Dinavigatours
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class={cn('grid gap-6', className)} {...rest}>
				<form method="POST" autocomplete="on" use:enhance={handleSubmit}>
					<div class="sr-only">
						<Label for="token">Token</Label>
						<Input
							id="token"
							name="token"
							placeholder="Verification Code"
							type="text"
							autocapitalize="none"
							autocomplete="off"
							autocorrect="off"
							disabled={isLoading}
							tabindex={-1}
							bind:value
						/>
					</div>
					<div class="flex flex-col justify-center space-y-5">
						<InputOTP.Root bind:value disabled={isLoading} maxlength={6}>
							{#snippet children({ cells })}
								<InputOTP.Group>
									{#each cells.slice(0, 3) as cell}
										<InputOTP.Slot {cell} />
									{/each}
								</InputOTP.Group>
								<InputOTP.Separator />
								<InputOTP.Group>
									{#each cells.slice(3, 6) as cell}
										<InputOTP.Slot {cell} />
									{/each}
								</InputOTP.Group>
							{/snippet}
						</InputOTP.Root>

						<Button type="submit" disabled={isLoading}>
							{#if isLoading}
								<Loader class="animate-spin" />
								<span>Verifying...</span>
							{:else}
								<span>Verify</span>
							{/if}
						</Button>
					</div>
				</form>
			</div>
		</Card.Content>
	</Card.Root>
</div>
