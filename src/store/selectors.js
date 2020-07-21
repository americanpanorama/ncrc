import { createSelector } from 'reselect';
import Rasters from '../data/Rasters.json';
import Cities from '../data/Cities.json';

const stateabbrs = {"AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"};

const getSelectedCity = state => state.selectedCity;
//const getSelectedArea = state => state.selectedArea;

export const getRasters = createSelector(
  [getSelectedCity],
  (selectedCity) => {
    const { mapIds } = Cities.find(c => c.ad_id === selectedCity);
    const rasters = Rasters.filter(r => mapIds.includes(r.id));
    return rasters.map(r => ({
      ...r,
      url: `//s3.amazonaws.com/holc/tiles/${r.state}/${r.file_name}/${r.year}/{z}/{x}/{y}.png`,
    }));
  },
);

export const getSelectedCityPolygonsPath = createSelector(
  [getSelectedCity],
  (selectedCity) => {
    const raster = Cities.find(r => r.ad_id === selectedCity);
    return `${raster.state}${raster.file_name}${raster.year}.json`;
  }
);

export const getSelectedCityFilePath = createSelector(
  [getSelectedCity],
  (selectedCity) => {
    return getCityFilePath(selectedCity);
  }
);

export const getMappingInequalityLink = createSelector(
  [getSelectedCity],
  (selectedCity) => {
    const { name, state } = Cities.find(c => c.ad_id === selectedCity);
    const cityStub = `${name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}-${state.toLowerCase()}`;
    return `https://dsl.richmond.edu/panorama/redlining/#city=${cityStub}`;
  }
);

export const getSearchOptions = () => {
  const states = [];
  Cities.forEach(c => {
    const stateIdx = states.findIndex(s => s.label === stateabbrs[c.state]);
    if (stateIdx === -1) {
      states.push({
        label: stateabbrs[c.state],
        options: [{
          value: c.ad_id,
          label: c.name,
        }]
      })
    } else {
      states[stateIdx].options.push({
        value: c.ad_id,
        label: c.name,
      });
    }
  });

  states.forEach(state => {
    state.options = state.options.sort((a, b) => (a.label > b.label) ? 1 : -1);
  })

  return states.sort((a, b) => (a.label > b.label) ? 1 : -1);
};

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
