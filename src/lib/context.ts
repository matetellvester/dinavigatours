import { getContext, setContext } from 'svelte';

interface MediaSource {
	src: string;
	name: string;
	copyright: string;
	desp: string;
	path: string;
	isThumbnail: boolean;
	file: File;
	type: 'image' | 'video';
}

let mediaKey = Symbol('mediaSource');

export function setMediaSourceContext(user: MediaSource[]) {
	setContext(mediaKey, user);
}

export function getMediaSourceContext(): MediaSource[] {
	return getContext(mediaKey) as MediaSource[];
}
