import { connect } from 'react-redux';
import HOLCRasters from './HOLCRasters.jsx';
import { getRaster } from '../store/selectors';

const mapStateToProps = state => ({
  map: getRaster(state),
});

export default connect(mapStateToProps)(HOLCRasters);
