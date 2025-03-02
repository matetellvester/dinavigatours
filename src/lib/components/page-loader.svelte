<script lang="ts">
	import { navigating } from '$app/stores';
	let isNavigating = $state(false);

	$effect(() => {
		if ($navigating) {
			const interval = setInterval(() => {
				isNavigating = true;
			}, 200);

			return () => {
				isNavigating = false;
				clearInterval(interval);
			};
		}
	});
</script>

{#if isNavigating}
	<div class="progress-bar bg-foreground">
		<div
			class="overlay bg-gradient-to-r from-transparent from-5% via-primary/80 via-30% to-primary/80 to-90%"
		></div>
	</div>
{/if}

<style>
	.progress-bar {
		position: fixed;
		top: 0;
		left: 0;
		height: 4px;
		z-index: 90;
		width: 0%;
		overflow: hidden;
		animation: growWidth 1.5s linear forwards;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 0%;
		animation: moveOverlay 1.5s linear infinite;
		animation-delay: 1.5s;
	}

	@keyframes growWidth {
		0% {
			width: 0%;
		}
		100% {
			width: 100%;
		}
	}

	@keyframes moveOverlay {
		0% {
			width: 0%;
			left: 0%;
		}
		20% {
			width: 20%;
		}
		100% {
			width: 100%;
			left: 100%;
		}
	}
</style>
