import Cities from '../data/Cities.json';

let zoom = 5;
let lat = 39.10;
let lng = -94.58;
let selectedCity = 168;
let selectedArea = null;
let selectedTract = null;

const { hash } = window.location;
hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
  const [key, value] = pair.split('=');
  if (key === 'loc') {
    [zoom, lat, lng] = value.split('/').map(str => parseFloat(str));
  }
  if (key === 'city') {
    selectedCity = Cities.find(c => c.slug === value).ad_id;
  }
  if (key === 'area') {
    selectedArea = value;
  }
  if (key === 'tract') {
    selectedTract = value;
  }
});


export default {
  selectedCity,
  selectedTractView: 'sovi',
  selectedArea,
  hoveredArea: null,
  selectedTract,
  hoveredTract: null,
  map: {
    zoom,
    center: [lat, lng],
    bounds: [],
  },
};
