import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const role = locals.role;
	if (role) {
		if (role == 1) {
			redirect(303, '/adm');
		}
		if (role == 2) {
			redirect(303, '/b');
		}
	}

	const { data, error } = await locals.supabase
		.from('ltsng_basic_info')
		.select(
			`id, name, rate, description, municipality, bgry, map_link, can_book, branch, media:ltsng_media(src, type, isThumbnail), ratings(rating)`
		)
		.eq('is_approved', true);

	return {
		//@ts-ignore
		exploreItems: transformData(data) as (ExploreItem & { branch: string; can_book: boolean })[]
	};
};

function calculateAverageRating(ratings: { rating: number }[]): number {
	const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
	const average = Math.round(total / ratings.length); // Round to the nearest whole number
	return average;
}

function transformData(
	data: {
		id: number;
		name: string;
		rate: number;
		description: string;
		municipality: string;
		bgry: string;
		branch: string;
		can_book: boolean;
		map_link: string;
		ratings: { rating: number }[];
		media: { src: any; type: any; isThumbnail: any }[];
	}[]
): ExploreItem[] {
	return data.map((item) => {
		const averageRating =
			item.ratings.length > 0 ? calculateAverageRating(item.ratings) : undefined;

		return {
			id: item.id,
			name: item.name,
			rate: item.rate,
			description: item.description,
			municipality: item.municipality,
			can_book: item.can_book,
			bgry: item.bgry,
			branch: item.branch,
			map_link: item.map_link,
			rating:
				averageRating !== undefined
					? { average: averageRating, count: item.ratings.length }
					: undefined,
			media: item.media.map(({ src, type, isThumbnail }) => ({
				src,
				type,
				isThumbnail
			}))
		};
	});
}
