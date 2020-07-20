import { connect } from 'react-redux';
import HOLCAreaData from './HOLCAreaData.jsx';
import { selectHOLCPolygon } from '../store/Actions';
import { getMappingInequalityLink } from '../store/selectors';

const mapStateToProps = state => ({
  selectedArea: state.selectedArea,
  selectedTract: state.selectedTract,
  mappingInequalityLink: getMappingInequalityLink(state),
});

const mapDispatchToProps = {
  selectHOLCPolygon,
};

export default connect(mapStateToProps, mapDispatchToProps)(HOLCAreaData);
