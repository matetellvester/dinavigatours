import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals, params }) => {
	try {
		const { id } = params;
	} catch (error) {}
};
