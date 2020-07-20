import { connect } from 'react-redux';
import TractData from './TractData.jsx';
import { unselectTract } from '../store/Actions';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    unselectTract
};

export default connect(mapStateToProps, mapDispatchToProps)(TractData);
