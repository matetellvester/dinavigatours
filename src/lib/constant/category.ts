import {
	Bus,
	Dumbbell,
	Holiday,
	Hotel,
	IslandOnWater,
	Massage,
	Motorcycle,
	Nature,
	Pickup,
	Sailboat
} from '$lib/components/svg';

const tours = ['Island Hopping', 'Day Trips', 'Boat Tours'] as const;

const accommodations = [
	'Hotels',
	'Resorts'
	// 'Homestays',
	// 'Guesthouses'
	// 'Vacation Rentals'
] as const;

// const foodAndDining = ['Local Cuisine', 'Restaurants', 'Cafés'] as const;
// const foodAndDining_ = ['Restaurants'] as const;

const attractions = ['Beach', 'Landmarks', 'Nature Parks', 'Scenic Views'] as const;

const naturalSpots = ['Beach', 'Lagoon', 'Waterfall', 'Lake'];
// const activities = ['Water Sports', 'Diving'] as const;

const transportationRentals = [
	'Car Rentals',
	'Motorcycle Rentals',
	// 'Shuttle Services',
	'Bus Services'
] as const;

const shopping = ['Souvenirs', 'Boutiques'] as const;

const wellnessAndFitness = ['Massage Therapy', 'Gyms'] as const;

const entertainmentAndEvents = ['Festivals', 'Bars', 'Nightclubs'] as const;

const services = [
	'Photography',
	'Videography',
	'Tour Guides',
	'Event Planning',
	'Catering'
] as const;

export enum Category {
	Tours = 'Tours',
	Accommodations = 'Accommodations',
	// FoodAndDining = 'Food & Dining',
	Attractions = 'Attractions', //❌
	// Activities = 'Activities',
	NaturalSpots = 'Natural Spots',
	TransportationRentals = 'Transportation Rentals',
	Shopping = 'Shopping', //❌
	WellnessAndFitness = 'Wellness And Fitness', //❌
	EntertainmentAndEvents = 'Entertainment And Events'
	// Services = 'Services'
}

export enum Category_ {
	Tours = Category.Tours,
	Accommodations = Category.Accommodations,
	// FoodAndDining = Category.FoodAndDining,
	// Activities = Category.Activities,
	// NaturalSpots = Category.NaturalSpots,
	TransportationRentals = Category.TransportationRentals,
	WellnessAndFitness = Category.WellnessAndFitness
	// Services = Category.Services
}

type SubcategoryMapping = {
	[key in Category]: readonly string[];
};
type SubcategoryMapping_ = {
	[key in Category_]: readonly string[];
};

// export const SUBCATEGORY_MAPPING: SubcategoryMapping = {
// 	[Category.Tours]: tours,
// 	[Category.Accommodations]: accommodations,
// 	[Category.FoodAndDining]: foodAndDining,
// 	[Category.Attractions]: attractions,
// 	[Category.Activities]: activities,
// 	[Category.TransportationRentals]: transportationRentals,
// 	[Category.Shopping]: shopping,
// 	[Category.WellnessAndFitness]: wellnessAndFitness,
// 	[Category.EntertainmentAndEvents]: entertainmentAndEvents,
// 	[Category.Services]: services
// };

// export const SUBCATEGORY_MAPPING_: SubcategoryMapping_ = {
// 	[Category.Tours]: tours,
// 	[Category.Accommodations]: accommodations,
// 	[Category.FoodAndDining]: foodAndDining_,
// 	[Category.Activities]: activities,
// 	[Category.TransportationRentals]: transportationRentals,
// 	[Category.WellnessAndFitness]: wellnessAndFitness_,
// 	[Category.Services]: services
// };

const baseSubcategoryMapping = {
	[Category.Tours]: tours,
	[Category.Accommodations]: accommodations,
	// [Category.FoodAndDining]: foodAndDining,
	// [Category.Activities]: activities,
	[Category.NaturalSpots]: naturalSpots,
	[Category.TransportationRentals]: transportationRentals,
	[Category.WellnessAndFitness]: wellnessAndFitness
	// [Category.Services]: services
};

// Extend or modify base mappings for the second one
export const SUBCATEGORY_MAPPING: SubcategoryMapping = {
	...baseSubcategoryMapping,
	[Category.Attractions]: attractions,
	[Category.Shopping]: shopping,
	[Category.EntertainmentAndEvents]: entertainmentAndEvents // Add this one specifically for this map
};

export const SUBCATEGORY_MAPPING_: SubcategoryMapping_ = {
	...baseSubcategoryMapping
	// [Category.FoodAndDining]: foodAndDining_,
	// [Category.WellnessAndFitness]: wellnessAndFitness // Override this one specifically
};

export function getSubcategories(category: Category): string[] {
	return [...SUBCATEGORY_MAPPING[category]];
}
export function getSubcategoriesNonBook(category: Category_): string[] {
	return [...SUBCATEGORY_MAPPING_[category]];
}

export const AllCategoriesWithIcon = {
	IslandHopping: { name: 'Island Hopping', icon: IslandOnWater },
	DayTrips: { name: 'Day Trips', icon: Nature },
	BoatTour: { name: 'Boat Tour', icon: Sailboat },
	Hotel: { name: 'Hotel', icon: Hotel },
	Resort: { name: 'Resort', icon: Holiday },
	CarRentals: { name: 'Car Rentals', icon: Pickup },
	MotorcycleRentals: { name: 'Motorcycle Rentals', icon: Motorcycle },
	Bus: { name: 'Bus', icon: Bus },
	Massage: { name: 'Massage', icon: Massage },
	Gyms: { name: 'Gyms', icon: Dumbbell }
};
