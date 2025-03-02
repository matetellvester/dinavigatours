import { json } from '@sveltejs/kit';

export async function DELETE({ locals, params }) {
	const { id } = params;

	const { error } = await locals.supabase.from('events').delete().eq('id', id);

	if (error) {
		return json({ success: false, error: error.message }, { status: 500 });
	}

	return json({ success: true, message: 'Event deleted successfully' }, { status: 200 });
}
