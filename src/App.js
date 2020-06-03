import { connect } from 'react-redux';
import App from './App.jsx';
import { getSelectedCityPolygonsPath } from './store/selectors.js';

const mapStateToProps = (state) => {
  return {
    holcPolygonsFilePath: getSelectedCityPolygonsPath(state),
  };
};

export default connect(mapStateToProps)(App);
