import { untrack } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';

const MOBILE_BREAKPOINT = 768;

export class IsMobile {
	#current = $state<boolean>(false);

	constructor() {
		$effect(() => {
			return untrack(() => {
				const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
				const onChange = () => {
					this.#current = window.innerWidth < MOBILE_BREAKPOINT;
				};
				mql.addEventListener('change', onChange);
				onChange();
				return () => {
					mql.removeEventListener('change', onChange);
				};
			});
		});
	}

	get current() {
		return this.#current;
	}
}

export const isDesktop = new MediaQuery('(min-width: 768px)');
