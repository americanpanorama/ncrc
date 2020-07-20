import * as L from 'leaflet';
import Actions from './ActionTypes';
import Cities from '../data/Cities.json';

function moveMap(currentMapParams, updatedMapParams) {
  return {
    type: Actions.MOVE_MAP,
    payload: {
      ...currentMapParams,
      ...updatedMapParams,
    },
  };
}

export function selectCity(eOrId, coords) {
  return async (dispatch, getState) => {
    const id = getEventId(eOrId, 'number');

    // get data from the city that you need for the path and to set the map zoom and center
    // const { cities, dimensions, map, selectedCity, loadingCity } = getState();
    const { selectedCity, loadingCity, map } = getState();
    // const { loadingPolygonsFor, zoom: currentZoom } = map;

    const dimensions = {};

    const { bounds } = Cities.find(c => c.ad_id === id);
    const centerAndZoom = coords || calculateCenterAndZoom(bounds, dimensions);

    // if it's already loaded or is being loaded test to see if you need to zoom
    if (selectedCity === id || loadingCity === id) {
      dispatch({
        type: Actions.MOVE_MAP,
        payload: {
          ...map,
          ...centerAndZoom,
          // aboveThreshold: true,
          // visibleRasters: [
          //   ...map.visibleRasters.filter(m => !mapIds.includes(m.id)),
          //   ...map.visibleRasters.filter(m => mapIds.includes(m.id)),
          // ],
        },
      });
    }

    // move the map
    dispatch(moveMap(map, centerAndZoom));

    dispatch({
      type: Actions.SELECT_CITY,
      payload: id,
    });

    // load the city data
    // if (loadingPolygonsFor !== id) {
    //   const cityPolygons = await fetchJSON(`./static/polygons/${path}`);
    //   cityPolygons.boundaries = (cityPolygons.boundary) ? [cityPolygons.boundary] : [];
    //   actions.push({
    //     type: Actions.LOADED_POLYGONS,
    //     payload: cityPolygons,
    //   });
    // }
    // dispatch(batchActions(actions));

    return null;
  };
}

export function updateMap(mapState) {
  return {
    type: Actions.MOVE_MAP,
    payload: mapState,
  };
}

export function selectHOLCPolygon(eOrId) {
  const id = getEventId(eOrId);
  return {
    type: Actions.SELECT_AREA,
    payload: id,
  }
}

export function unselectHOLCPolygon() {
  return {
    type: Actions.UNSELECT_AREA,
  };
}

export function onHoverHOLCPolygon(eOrId) {
  const id = getEventId(eOrId);
  return {
    type: Actions.HOVER_AREA,
    payload: id,
  }
}

export function selectTract(eOrId) {
  const id = getEventId(eOrId);
  return {
    type: Actions.SELECT_TRACT,
    payload: id,
  }
}

export function unselectTract() {
  return {
    type: Actions.UNSELECT_TRACT,
  };
}

export function selectTractView(eOrId) {
  const id = getEventId(eOrId);
  return {
    type: Actions.SELECT_TRACT_VIEW,
    payload: id,
  }
}

export function onUnhoverHOLCPolygon() {
  return {
    type: Actions.UNHOVER_AREA,
  };
}

export function onHoverTract(eOrId) {
  const id = getEventId(eOrId);
  return {
    type: Actions.HOVER_TRACT,
    payload: id,
  }
}

export function onUnhoverTract() {
  return {
    type: Actions.UNHOVER_TRACT,
  };
}

export function selectHOLCPolygonOrTract(eOrId) {
  return (dispatch, getState) => {
    const { selectedArea } = getState();
    if (selectedArea) {
      const id = `${selectedArea.split('-')[0]}-${getEventId(eOrId)}`;
      dispatch(selectHOLCPolygon(id));
    } else {
      dispatch(selectTract(getEventId(eOrId)));
    }
  };
}

export function onHoverHOLCPolygonOrTract(eOrId) {
  return (dispatch, getState) => {
    const { selectedArea } = getState();
    if (selectedArea) {
      const id = `${selectedArea.split('-')[0]}-${getEventId(eOrId)}`;
      dispatch(onHoverHOLCPolygon(id));
    } else {
      dispatch(onHoverTract(getEventId(eOrId)));
    }
  };
}

export function onUnhoverHOLCPolygonOrTract(eOrId) {
  return (dispatch, getState) => {
    const { selectedArea } = getState();
    if (selectedArea) {
      dispatch(onUnhoverHOLCPolygon());
    } else {
      dispatch(onUnhoverTract());
    }
  };
}

// UTILITY FUNCTIONS
// function getCityFilePath(adId, cities) {
//   const { name, state, year } = cities.find(c => c.ad_id === adId);
//   return `${`${state}${name}${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
// }

function getEventId(eOrId, type = 'string') {
  let id = eOrId.id || eOrId;
  if (!eOrId.id && typeof eOrId === 'object') {
    const ct = eOrId.currentTarget || eOrId.target;
    id = ct.id || ct.options.id;
  }
  return (type === 'number') ? parseInt(id, 10) : id;
}

function calculateCenterAndZoom(bounds) {
  const mapWidth = window.innerWidth * 2 / 5;
  const mapHeight = window.innerHeight - 100;



  // create a leaflet map to run some of the map math, starting with the map bounds as a leaflet latlngbounds object.
  const map = L.map(document.createElement('div'), {
    center: [0, 0],
    zoom: 0,
  });
  const polygonBounds = L.latLngBounds(bounds);

  // this is uncomfortably hacky
  // set the leaflet map instance size and view centering the bounds so you can get the bounds of the actual map
  map._size = L.point(mapWidth, mapHeight);
  map.setView(polygonBounds.getCenter(), 12);
  //const mapBounds = map.getBounds();
  
  // Calculate the zoom using the polygonBounds and the width of the visible part of the map.
  // The padding (insetWidth/insetHeight) is needed because the leaflet map isn't in the dom
  // and doesn't have dimensions
  const zoom = map.getBoundsZoom(polygonBounds);


  // calculate the center  for the inset
  let { lat, lng } = polygonBounds.getCenter();

  return {
    zoom,
    center: [lat, lng],
  };
}

// function getNSWE(bounds) {
//   return {
//     n: Math.max(bounds[0][0], bounds[1][0]),
//     s: Math.min(bounds[0][0], bounds[1][0]),
//     e: Math.max(bounds[0][1], bounds[1][1]),
//     w: Math.min(bounds[0][1], bounds[1][1]),
//   };
// }
