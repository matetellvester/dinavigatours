import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

import type { LayoutLoad } from './$types';

import '$lib/globalFunctions';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */

	// const url = 'https://kbbbgnhqlxvswspelkmu.supabase.co';
	// const anon =
	// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiYmJnbmhxbHh2c3dzcGVsa211Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg2MDQ2ODIsImV4cCI6MjA0NDE4MDY4Mn0.bcLc_1_N-jRsk1SCMqtojBgQ1KVQ8E-XbkMHY9DTQgg';
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	return { session, supabase, user, role: data.role };
};
