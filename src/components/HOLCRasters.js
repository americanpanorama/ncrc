import { connect } from 'react-redux';
import HOLCRasters from './HOLCRasters.jsx';
import { getRasters } from '../store/selectors';

const mapStateToProps = state => ({
  maps: getRasters(state),
});

export default connect(mapStateToProps)(HOLCRasters);
