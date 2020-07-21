import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../../Buttons/presentational/Close';
import ZoomToButton from '../../Buttons/presentational/ZoomTo';

const HeaderArea = ({ holcId, adId, name, unselectArea, zoomToArea }) => (
  <header>
    <button
      onClick={unselectArea}
      role="button"
      tabIndex={1}
      style={{
        marginLeft: 5,
      }}
    >
      Close
    </button>
    <h3>
      {holcId}
      {(name) ? ` ${name}` : ''}

    </h3>
  </header>
);

export default HeaderArea;

HeaderArea.propTypes = {
  holcId: PropTypes.string.isRequired,
  adId: PropTypes.number.isRequired,
  name: PropTypes.string,
  unselectArea: PropTypes.func.isRequired,
  zoomToArea: PropTypes.func.isRequired,
};

HeaderArea.defaultProps = {
  name: undefined,
};
