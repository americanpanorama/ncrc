import { connect } from 'react-redux';
import AreaPolygons from './AreaPolygons.jsx';
//import { selectArea, unselectArea, highlightArea, unhighlightArea } from '../store/Actions';
import { getSelectedCityPolygonsPath } from '../store/selectors';
import { selectHOLCPolygon, unselectHOLCPolygon, onHoverHOLCPolygon, onUnhoverHOLCPolygon } from '../store/Actions';


const mapStateToProps = (state) => {
  // const { selectedCity, selectedArea } = state;

  //const polygons = getPolygons(state);

  // if (selectedArea) {
  //   // invert the selected polygon
  //   //Create a new set of latlngs, adding our world-sized ring first
  //   const NWHemisphere = [[0, 0], [0, 90], [-180, 90], [-180, 0], [0, 0]];
  //   const newLatLngs = [NWHemisphere];
  //   const holes = [];

  //   const selectedPolygon = polygons.find(p => p.ad_id === selectedCity && p.id === selectedArea);

  //   if (selectedPolygon) {
  //     selectedPolygon.area_geojson.coordinates.forEach((polygon) => {
  //       polygon.forEach((polygonpieces, i) => {
  //         if (i === 0) {
  //           newLatLngs.push(polygonpieces);
  //         } else {
  //           holes.push(polygonpieces);
  //         }
  //       });
  //     });
  //   }
  // }
  
  return {
    //polygons,
  };
};

const mapDispatchToProps = {
  onHoverHOLCPolygon,
  onUnhoverHOLCPolygon,
  selectHOLCPolygon,
  unselectHOLCPolygon,
  // selectArea,
  // unselectArea,
  // highlightArea,
  // unhighlightArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaPolygons);
