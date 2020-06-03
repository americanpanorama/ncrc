import { connect } from 'react-redux';
import SVMap from './SVMap.jsx';
import { selectTract, onHoverTract, onUnhoverTract } from '../store/Actions';

const mapStateToProps = (state) => {
  const { map, hoveredArea, selectedArea, selectedCity, selectedTract } = state;
  const { zoom, center, bounds } = map;
  let className = '';
  // if (showSVMaps && highlightedPolygons.length > 0) {
  //   className = `greyscale zoom-${zoom}`;
  // }
  // if (selectedGrade) {
  //   className = 'greyscale';
  // }
  return {
    zoom,
    center,
    bounds,
    hoveredArea,
    selectedArea,
    selectedCity,
    selectedTract,
    // showSVMaps,
    // aboveThreshold,
    // style: dimensions.mapStyle,
    // className,
  };
};

const mapDispatchToProps = {
  selectTract,
  onHoverTract,
  onUnhoverTract,
};

export default connect(mapStateToProps, mapDispatchToProps)(SVMap);
