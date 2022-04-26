import { createApi } from 'unsplash-js';

const unsplashApi = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY });

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v2/venues/search?ll=${latLong}&query=${query}&client_id=${process.env.FOURSQUARE_CLIENT_ID}&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 10,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls['small']);
};

export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(
    getUrlForCoffeeStores('43.65267, -79.39545', 'coffee stores', 6)
  );
  const data = await response.json();

  return data.response.venues.map((venue, index) => ({
    id: venue.id,
    address: venue.location.address || '',
    name: venue.name,
    neighbourhood:
      venue.location.neighborhood || venue.location.crossStreet || '',
    imgUrl: photos[index],
  }));
};
