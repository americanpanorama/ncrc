import { connect } from 'react-redux';
import BeeswarmGraph from './BeeswarmGraph.jsx';
import { selectHOLCPolygonOrTract, onHoverHOLCPolygonOrTract, onUnhoverHOLCPolygonOrTract, selectTractView } from '../store/Actions';

const mapStateToProps = state => ({
  selectedView: (state.selectedArea) ? 'holcArea' : 'tract',
  selectedADId: (state.selectedArea) ? state.selectedArea.split('-')[0] : null,
});

const mapDispatchToProps = {
  select: selectHOLCPolygonOrTract,
  onUnhover: onUnhoverHOLCPolygonOrTract,
  onHover: onHoverHOLCPolygonOrTract,
  selectTractView,
};

export default connect(mapStateToProps, mapDispatchToProps)(BeeswarmGraph);
