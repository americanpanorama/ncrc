import { combineReducers } from 'redux';
import A from './ActionTypes';
import initialState from './initialState';

const selectedCity = (state = initialState.selectedCity, action) => {
  if (action.type === A.SELECT_CITY) {
    return action.payload;
  }

  return state;
};

const map = (state = initialState.map, action) => {
  if (action.type === A.ZOOM_IN) {
    return {
      ...state,
      aboveThreshold: (state.zoom + 1 >= 9),
      zoom: state.zoom + 1,
    };
  }

  if (action.type === A.ZOOM_OUT) {
    return {
      ...state,
      aboveThreshold: (state.zoom + 1 >= 9),
      zoom: state.zoom - 1,
    };
  }

  if (action.type === A.MOVE_MAP) {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === A.GEOLOCATING) {
    return {
      ...state,
      geolocating: true,
    };
  }

  if (action.type === A.GEOLOCATION_ERROR) {
    return {
      ...state,
      geolocating: false,
    };
  }

  if (action.type === A.LOCATED_USER) {
    return {
      ...state,
      userPosition: action.payload,
      geolocating: false,
    };
  }

  if (action.type === A.SEARCHING_ADS_RESULTS) {
    return {
      ...state,
      highlightedPolygons: action.payload,
    };
  }

  if (action.type === A.HIGHLIGHT_AREAS) {
    return {
      ...state,
      highlightedPolygons: action.payload,
    };
  }

  if (action.type === A.UNHIGHLIGHT_AREA || action.type === A.UNSELECT_AREA
    || action.type === A.SELECT_CITY_REQUEST) {
    return {
      ...state,
      highlightedPolygons: [],
    };
  }

  // select city also gets the polygons
  if (action.type === A.SELECT_CITY_REQUEST) {
    return {
      ...state,
      loadingPolygonsFor: [
        ...state.loadingPolygonsFor,
        action.payload,
      ],
    };
  }

  if (action.type === A.LOADING_POLYGONS) {
    return {
      ...state,
      loadingPolygonsFor: [
        ...state.loadingPolygonsFor,
        ...action.payload,
      ],
    };
  }

  if (action.type === A.SELECT_CITY_SUCCESS || action.type === A.UNSELECT_CITY) {
    return {
      ...state,
      highlightedPolygons: [],
    };
  }

  if (action.type === A.LOADED_POLYGONS) {
    const cityIdsFinished = [...new Set(action.payload.polygons.map(p => p.ad_id))];
    const loadingPolygonsFor = state.loadingPolygonsFor.filter(id => !cityIdsFinished.includes(id));
    return {
      ...state,
      visiblePolygons: action.payload.polygons,
      visibleRasterPolygons: action.payload.rasterBoundaries,
      visibleBoundaries: (action.payload.boundaries) ? action.payload.boundaries.filter(b => !!b) : [],
      loadingPolygonsFor,
    };
  }

  if (action.type === A.BRING_MAP_TO_FRONT) {
    return {
      ...state,
      sorting: false,
      sortingPossibilities: [],
      sortingLatLng: [],
      visibleRasterPolygons: [
        ...state.visibleRasterPolygons.filter(m => m.map_id !== action.payload),
        ...state.visibleRasterPolygons.filter(m => m.map_id === action.payload),
      ],
      visibleRasters: [
        ...state.visibleRasters.filter(m => m.id !== action.payload),
        ...state.visibleRasters.filter(m => m.id === action.payload),
      ],
    };
  }

  if (action.type === A.TOGGLE_SORTING_MAPS) {
    return {
      ...state,
      sorting: !state.sorting,
      sortingPossibilities: [],
      sortingLatLng: [],
    };
  }

  if (action.type === A.SORT_MAP_POSSIBILITIES) {
    return {
      ...state,
      sortingPossibilities: action.payload.ids,
      sortingLatLng: action.payload.latLng,
    };
  }

  if (action.type === A.SELECT_CATEGORY) {
    return {
      ...state,
      highlightedPolygons: [],
    };
  }

  return state;
};

const selectedArea = (state = initialState, action) => {
  if (action.type == A.SELECT_AREA) {
    return action.payload;
  }
  if (action.type === A.UNSELECT_AREA || action.type === A.SELECT_CITY) {
    return null;
  }
  return state;
}

const hoveredArea = (state = initialState, action) => {
  if (action.type == A.HOVER_AREA) {
    return action.payload;
  }
  if (action.type === A.UNHOVER_AREA || action.type === A.SELECT_CITY) {
    return null;
  }
  return state;
}

const selectedTract = (state = initialState, action) => {
  if (action.type == A.SELECT_TRACT) {
    return action.payload;
  }
  if (action.type === A.UNSELECT_TRACT || action.type === A.SELECT_CITY) {
    return null;
  }
  return state;
}

const hoveredTract = (state = initialState, action) => {
  if (action.type == A.HOVER_TRACT) {
    return action.payload;
  }
  if (action.type === A.UNHOVER_TRACT) {
    return null;
  }
  return state;
}

const combinedReducer = combineReducers({
  selectedCity,
  map,
  selectedArea,
  hoveredArea,
  selectedTract,
  hoveredTract,
});

export default combinedReducer;
