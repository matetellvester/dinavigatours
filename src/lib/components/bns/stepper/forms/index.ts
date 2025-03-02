import Beach from './beach.svelte';
import BusServices from './bus-services.svelte';
import BoatTours from './boat-tours.svelte';
import CarRentals from './car-rentals.svelte';
import Catering from './catering.svelte';
import Diving from './diving.svelte';
import DayTrips from './day-trips.svelte';
import EventPlanning from './event-planning.svelte';
import Guesthouses from './guesthouses.svelte';
import Gyms from './gyms.svelte';
import HeritageSites from './heritage-sites.svelte';
import Hiking from './hiking.svelte';
import Homestays from './homestays.svelte';
import Hotels from './hotels.svelte';
import IslandHopping from './island-hopping.svelte';
import MassageTherapy from './massage-therapy.svelte';
import MotorcycleRentals from './motorcycle-rentals.svelte';
import Photography from './photography.svelte';
import Resorts from './resorts.svelte';
import Restaurants from './restaurants.svelte';
import Saunas from './saunas.svelte';
import ShuttleServices from './shuttle-services.svelte';
import TherapeuticServices from './therapeutic-services.svelte';
import TourGuides from './tour-guides.svelte';
import TourPackages from './tour-packages.svelte';
import Tricycles from './tricycles.svelte';
import VacationRentals from './vacation-rentals.svelte';
import Videography from './videography.svelte';
import WaterSports from './water-sports.svelte';
import Yoga from './yoga.svelte';

export { default as Beach } from './beach.svelte';
export { default as BusServices } from './bus-services.svelte';
export { default as BoatTours } from './boat-tours.svelte';
export { default as CarRentals } from './car-rentals.svelte';
export { default as Catering } from './catering.svelte';
export { default as Diving } from './diving.svelte';
export { default as DayTrips } from './day-trips.svelte';
export { default as EventPlanning } from './event-planning.svelte';
export { default as Guesthouses } from './guesthouses.svelte';
export { default as Gyms } from './gyms.svelte';
export { default as HeritageSites } from './heritage-sites.svelte';
export { default as Hiking } from './hiking.svelte';
export { default as Homestays } from './homestays.svelte';
export { default as Hotels } from './hotels.svelte';
export { default as IslandHopping } from './island-hopping.svelte';
export { default as MassageTherapy } from './massage-therapy.svelte';
export { default as MotorcycleRentals } from './motorcycle-rentals.svelte';
export { default as Photography } from './photography.svelte';
export { default as Resorts } from './resorts.svelte';
export { default as Restaurants } from './restaurants.svelte';
export { default as Saunas } from './saunas.svelte';
export { default as ShuttleServices } from './shuttle-services.svelte';
export { default as TherapeuticServices } from './therapeutic-services.svelte';
export { default as TourGuides } from './tour-guides.svelte';
export { default as TourPackages } from './tour-packages.svelte';
export { default as Tricycles } from './tricycles.svelte';
export { default as VacationRentals } from './vacation-rentals.svelte';
export { default as Videography } from './videography.svelte';
export { default as WaterSports } from './water-sports.svelte';
export { default as Yoga } from './yoga.svelte';

export const AllSubCategories = [
	{ name: 'Beach', component: Beach },
	{ name: 'BusServices', component: BusServices },
	{ name: 'BoatTours', component: BoatTours },
	{ name: 'CarRentals', component: CarRentals },
	{ name: 'Catering', component: Catering },
	{ name: 'Diving', component: Diving },
	{ name: 'DayTrips', component: DayTrips },
	{ name: 'EventPlanning', component: EventPlanning },
	{ name: 'Guesthouses', component: Guesthouses },
	{ name: 'Gyms', component: Gyms },
	{ name: 'HeritageSites', component: HeritageSites },
	{ name: 'Hiking', component: Hiking },
	{ name: 'Homestays', component: Homestays },
	{ name: 'Hotels', component: Hotels },
	{ name: 'IslandHopping', component: IslandHopping },
	{ name: 'MassageTherapy', component: MassageTherapy },
	{ name: 'MotorcycleRentals', component: MotorcycleRentals },
	{ name: 'Photography', component: Photography },
	{ name: 'Resorts', component: Hotels },
	{ name: 'Restaurants', component: Restaurants },
	{ name: 'Saunas', component: Saunas },
	{ name: 'ShuttleServices', component: ShuttleServices },
	{ name: 'TherapeuticServices', component: TherapeuticServices },
	{ name: 'TourGuides', component: TourGuides },
	{ name: 'TourPackages', component: TourPackages },
	{ name: 'Tricycles', component: Tricycles },
	{ name: 'VacationRentals', component: VacationRentals },
	{ name: 'Videography', component: Videography },
	{ name: 'WaterSports', component: WaterSports },
	{ name: 'Yoga', component: Yoga }
] as const;

import type { AllSubCategoryiesType } from './types';
export function makeFormNameAttribute<T extends keyof AllSubCategoryiesType>(parentField: T) {
	return <K extends keyof AllSubCategoryiesType[T]>(entity: K) =>
		`${parentField}[${String(entity)}]`;
}
