import { connect } from 'react-redux';
import SVMap from './SVMap.jsx';
import { selectTract, onHoverTract, onUnhoverTract } from '../store/Actions';

const mapStateToProps = (state) => {
  const { map, hoveredArea, selectedArea, hoveredTract, selectedCity, selectedTract, selectedTractView } = state;
  const { zoom, center, bounds } = map;
  return {
    zoom,
    center,
    bounds,
    hoveredArea,
    hoveredTract,
    selectedArea,
    selectedCity,
    selectedTract,
    selectedTractView,
    // style: dimensions.mapStyle,
  };
};

const mapDispatchToProps = {
  selectTract,
  onHoverTract,
  onUnhoverTract,
};

export default connect(mapStateToProps, mapDispatchToProps)(SVMap);
