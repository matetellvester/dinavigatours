import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */

	// const url = 'https://kbbbgnhqlxvswspelkmu.supabase.co';
	// const anon =
	// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiYmJnbmhxbHh2c3dzcGVsa211Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg2MDQ2ODIsImV4cCI6MjA0NDE4MDY4Mn0.bcLc_1_N-jRsk1SCMqtojBgQ1KVQ8E-XbkMHY9DTQgg';

	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null, role: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error || !user) {
			// JWT validation has failed
			return { session: null, user: null, role: null };
		}

		const { data: role, error: errr } = await event.locals.supabase
			.from('userlist')
			.select('role')
			.eq('id', user.id)
			.single();

		return { session, user, role: role?.role as UserType | null };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user, role } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;
	event.locals.role = role;

	// if (!session && event.url.pathname.startsWith('/private')) {
	// 	redirect(303, '/auth');
	// }

	// if (session && event.url.pathname === '/auth') {
	// 	redirect(303, '/private');
	// }

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
// export const handle: Handle = sequence(supabase);
