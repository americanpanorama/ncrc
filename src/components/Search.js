import { connect } from 'react-redux';
import Search from './Search.jsx';
import { selectCity } from '../store/Actions';
import { getSearchOptions } from '../store/selectors';

const mapStateToProps = (state) => {
  return {
    options: getSearchOptions(state),
  };
};

const MapDispatchToProps = {
  selectCity,
};

export default connect(mapStateToProps, MapDispatchToProps)(Search);
