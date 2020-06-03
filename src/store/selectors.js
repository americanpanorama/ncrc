import { createSelector } from 'reselect';
import Rasters from '../data/Rasters.json';
import Cities from '../data/Cities.json';

const getSelectedCity = state => state.selectedCity;
const getSelectedArea = state => state.selectedArea;

export const getRaster = createSelector(
  [getSelectedCity],
  (selectedCity) => {
    const raster = Rasters.find(r => r.id === selectedCity);
    return {
      ...raster,
      url: `//s3.amazonaws.com/holc/tiles/${raster.state}/${raster.file_name}/${raster.year}/{z}/{x}/{y}.png`,
    }
  },
);

export const getSelectedCityPolygonsPath = createSelector(
  [getSelectedCity],
  (selectedCity) => {
    const raster = Rasters.find(r => r.id === selectedCity);
    return `${raster.state}${raster.file_name}${raster.year}.json`;
  }
);

export const getSearchOptions = createSelector(
  [],
  () => (
    Cities.map(c => ({
      ad_id: c.ad_id,
      searchName: c.searchName,
      name: c.name,
      state: c.state,
    }))
  ),
);

export const getSelectedCityData = createSelector(
  [getSelectedCity],
  (selectedCity) => Cities.find(c => c.ad_id === selectedCity),
);

export function getCityFilePath(adId) {
  if (!adId) {
    return null;
  }
  const { name, state, year } = Cities.find(c => c.ad_id === adId);
  return `${`${state}${name}${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
}
