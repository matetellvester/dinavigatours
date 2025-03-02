const itemsOld: ExploreItem[] = [
	{
		title: 'Emerald Bay Harbor',
		price: 2179.89,
		rating: { average: 4.9, count: 35 },
		location: { municipality: 'Kagayon', bgry: 'Basilisa', purok: '1' },
		src: ['/images/ammie-ngo-vcu-OZBxxRk-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Crystal Caverns',
		price: 3992.17,
		rating: { average: 1.5, count: 63 },
		src: ['/images/annie-spratt-G96zP4dbsIA-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Sunspire Valley',
		price: 4342.56,
		location: { municipality: 'Maambon', bgry: 'Basilisa', purok: '2' },
		src: ['/images/fabio-traina-goQWJTlS1wo-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Luna Shores Resort',
		price: 2772.29,
		location: { municipality: 'Esperanza', bgry: 'Loreto', purok: '3' },
		src: ['/images/hugo-coulbouee-iDLd3PJFd_U-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Cascade Falls Sanctuary',
		price: 3334.17,
		location: { municipality: 'San Roque', bgry: 'Dinagat', purok: '4' },
		src: ['/images/keith-luke-sPU2kzPIf28-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Willowbrook Gardens',
		price: 3667.93,
		src: ['/images/ksama-tIm8N5txDdI-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Starlight Observatory',
		price: 4752.43,
		rating: { average: 3.5, count: 89 },
		location: { municipality: 'Magsaysay', bgry: 'Libjo', purok: '5' },
		src: ['/images/lance-asper-d9Cs-9I1fPo-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Coral Reef Cove',
		price: 799.2,
		src: ['/images/lance-asper-iPK_3aOVdCM-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Maplewood Arboretum',
		price: 3108.95,
		location: { municipality: 'Osmeña', bgry: 'Tubajon', purok: '6' },
		src: ['/images/lance-asper-jdVINENz5Ys-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Pinecrest Adventure Park',
		price: 1561.38,
		rating: { average: 3.5, count: 250 },
		src: ['/images/lance-asper-L5aI2jU0i50-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Blue Horizon Boardwalk',
		price: 1083.83,
		rating: { average: 4.9, count: 306 },
		location: { municipality: 'Wilson', bgry: 'San Jose', purok: '1' },
		src: ['/images/luca-bravo-O453M2Liufs-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Echo Lake Pavilion',
		price: 3774.17,
		rating: { average: 2.7, count: 484 },
		src: ['/images/meg-von-haartman-amKspUVKfhE-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Golden Sands Retreat',
		price: 2875.71,
		location: { municipality: 'Doña Helen', bgry: 'Basilisa', purok: '2' },
		src: ['/images/mesut-kaya-eOcyhe5-9sQ-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Redwood Ridge Lookout',
		price: 4962.55,
		rating: { average: 3.3, count: 366 },
		src: ['/images/neom-eOWabmCNEdg-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Sunrise Summit Trails',
		price: 4684.06,
		rating: { average: 4.4, count: 421 },
		location: { municipality: 'Cuarinta', bgry: 'Dinagat', purok: '3' },
		src: ['/images/neom-STV2s3FYw7Y-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Silver Moon Theater',
		price: 1406.89,
		rating: { average: 3.3, count: 268 },
		location: { municipality: 'Lobo', bgry: 'Loreto', purok: '4' },
		src: ['/images/paz-arando-qZIM5rutBZM-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Paradise Peak Resort',
		price: 4215.0,
		rating: { average: 4.6, count: 344 },
		src: ['/images/shifaaz-shamoon-qtbV_8P_Ksk-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Misty Meadows Sanctuary',
		price: 882.07,
		rating: { average: 4.8, count: 291 },
		location: { municipality: 'Navarra', bgry: 'San Jose', purok: '5' },
		src: ['/images/tom-barrett-M0AWNxnLaMw-unsplash.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Twilight Marina',
		price: 573.09,
		location: { municipality: 'Santa Cruz', bgry: 'Libjo', purok: '6' },
		src: ['/images/photo-1625408851347-9a0ed832409c.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Solace Springs Resort',
		price: 1620.57,
		rating: { average: 1.1, count: 345 },
		src: ['/images/premium_photo-1718146019714-a7a0ab9e8e8d.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Granite Grove Quarry',
		price: 1200.23,
		rating: { average: 2.8, count: 162 },
		location: { municipality: 'Roxas', bgry: 'Tubajon', purok: '1' },
		src: ['/images/premium_photo-1718146019167-110481171ad2.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	},
	{
		title: 'Wildflower Plateau',
		price: 2827.51,
		rating: { average: 2.1, count: 416 },
		location: { municipality: 'Paraiso', bgry: 'Loreto', purok: '2' },
		src: ['/images/premium_photo-1683800241997-aeb0b5d72d68.jpg'],
		map_link: 'https://maps.app.goo.gl/PYAaec95RXeB7sPk8'
	}
];

const newLink = 'media/1732697043079-b38uurmk4p7.jpg';

export const items = itemsOld.map((item) => {
	// Ensure `src` exists and is an array
	if (Array.isArray(item.src) && item.src.length > 0) {
		// Replace the first index with the new link
		return { ...item, src: [newLink, ...item.src.slice(1)] };
	}
	return item; // Return the item as is if `src` is not an array or is empty
});

// console.log(items);
