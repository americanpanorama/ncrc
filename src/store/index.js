import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import Cities from '../data/Cities.json';

import reducers from './reducers';
import initialState from './initialState';

const logger = createLogger({
  collapsed: true,
  duration: true,
});

const hashManager = store => next => (action) => {
  const theNext = next(action);
  const nextState = store.getState();
  const {
    selectedCity,
    selectedArea,
    selectedTract,
    map
  } = store.getState();
  const { zoom, center } = map;
  const selectedCityData = (selectedCity) ? Cities.find(c => c.ad_id === selectedCity) : null;
  const lat = Math.round(center[0] * 1000) / 1000;
  const lng = Math.round(center[1] * 1000) / 1000;
  const newHash = {
    loc: `${zoom}/${lat}/${lng}`,
    city: (selectedCityData) ? selectedCityData.slug : null,
    area: nextState.selectedArea,
    tract: nextState.selectedTract,
  };
  const hash = `#${Object.keys(newHash)
    .filter(k => newHash[k])
    .map(k => `${k}=${newHash[k]}`).join('&')}`;
  const assign = (
    (newHash.city && newHash.city !== selectedCity)
    || (newHash.area && newHash.area !== selectedArea)
  );
  if (document.location.hash !== hash) {
    document.location.replace(hash);
  }
  return theNext;
};

const store = applyMiddleware(thunk, logger, hashManager)(createStore)(reducers, initialState);

export default store;
