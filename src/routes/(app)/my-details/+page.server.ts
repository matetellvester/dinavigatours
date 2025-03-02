import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { handleLoginRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		const fromUrl = url.pathname + url.search;

		throw redirect(302, handleLoginRedirect(url));
	}

	const { data, error } = await locals.supabase
		.from('userlist')
		.select('first_name, last_name, contact_info, validId, dateOfBirth, gender,nationality,address')
		.eq('id', user.id)
		.single();

	if (error) {
		return {
			info: null
		};
	}

	console.log(data);

	return {
		info: data as {
			first_name: string;
			last_name: string;
			contact_info: string;
			dateOfBirth: string;
			gender: string;
			nationality: string;
			address: string;
			validId: { num: string; type: string };
		}
	};
};
