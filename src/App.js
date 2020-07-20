import { connect } from 'react-redux';
import App from './App.jsx';
import { getSelectedCityPolygonsPath, getSelectedCityFilePath, getMappingInequalityLink} from './store/selectors.js';

const mapStateToProps = (state) => {
  return {
    selectedArea: state.selectedArea,
    selectedTract: state.selectedTract,
    holcPolygonsFilePath: getSelectedCityPolygonsPath(state),
    cityFilePath: getSelectedCityFilePath(state),
    mappingInequalityLink: getMappingInequalityLink(state),
  };
};

export default connect(mapStateToProps)(App);
