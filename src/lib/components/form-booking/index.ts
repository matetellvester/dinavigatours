import FormIslandHopping from './form-island-hopping.svelte';
import FormTransportationRental from './form-transportation-rental.svelte';
import FormAccomodations from './form-accomodations.svelte';
import FormGyms from './form-gyms.svelte';
import FormMassageTherapy from './form-massage-therapy.svelte';

export {
	FormIslandHopping,
	FormTransportationRental,
	FormAccomodations,
	FormGyms,
	FormMassageTherapy
};

export function getFormBookingComponent(key: string) {
	const componentsMap: Record<string, any> = {
		IslandHopping: FormIslandHopping,
		BoatTours: FormIslandHopping,
		DayTrips: FormIslandHopping,
		CarRentals: FormTransportationRental,
		MotorcycleRentals: FormTransportationRental,
		BusServices: FormTransportationRental,
		Hotels: FormAccomodations,
		Resorts: FormAccomodations,
		Gyms: FormGyms,
		MassageTherapy: FormMassageTherapy
	};
	return componentsMap[key];
}
