import { connect } from 'react-redux';
import HOLCMap from './HOLCMap.jsx';
//import { clickOnMap } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { hoveredTract, map, hoveredArea, selectedArea, selectedTract } = state;
  const { zoom, center, bounds } = map;
  let className = '';
  if (state.hoveredArea || state.selectedArea) {
    className = 'greyscale';
  }
  return {
    zoom,
    center,
    bounds,
    // showHOLCMaps,
    // aboveThreshold,
    // style: dimensions.mapStyle,
    className,
    hoveredArea,
    selectedArea,
    hoveredTract,
    selectedTract,
  };
};

const mapDispatchToProps = {
  //clickOnMap,
};

export default connect(mapStateToProps, mapDispatchToProps)(HOLCMap);
