import { connect } from 'react-redux';
import Sankey from './Sankey.jsx';
import { selectHOLCPolygon, unselectHOLCPolygon, onHoverHOLCPolygon, onUnhoverHOLCPolygon, selectTract, onHoverTract, onUnhoverTract } from '../store/Actions';

const mapStateToProps = state => ({
  hoveredArea: (state.hoveredArea) ? state.hoveredArea.replace(`${state.selectedCity}-`, '') : null,
  selectedArea: (state.selectedArea) ? state.selectedArea.replace(`${state.selectedCity}-`, '') : null,
  selectedCity: state.selectedCity,
  hoveredTract: state.hoveredTract,
  selectedTract: state.selectedTract,
});

const mapDispatchToProps = {
  onHoverHOLCPolygon,
  onUnhoverHOLCPolygon,
  selectHOLCPolygon,
  unselectHOLCPolygon,
  onHoverTract,
  onUnhoverTract,
  selectTract,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sankey);
