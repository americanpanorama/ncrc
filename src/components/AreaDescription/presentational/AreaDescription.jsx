import React from 'react';
import PropTypes from 'prop-types';

import HeaderArea from '../presentational/HeaderArea.jsx';
import useFetch from '../../useFetch.js';
import './AreaDescription.css';

const AreaDescription = ({ selectedArea, selectedCity, filePath, FormComponent, showHeader, formId, unselectHOLCPolygon }) => {
  if (!selectedArea || !filePath) {
    return null;
  }
  const resADs = useFetch(`./static/areadescriptions/${filePath}`, {headers: { accept: "application/json" }});
  if (!resADs.response) {
    return null;
  }
  if (!resADs.response.ads[selectedArea] || !resADs.response.ads[selectedArea].areaDesc) {
    console.warn(`did not find ad for ${selectedArea}`);
    return null;
  }
  const adData = resADs.response.ads[selectedArea].areaDesc;
  return (
    <div id="areaDescription">
      {(showHeader) && (
        <HeaderArea
          holcId={selectedArea}
          adId={selectedCity}
          name={(adData.name) ? adData.name : null}
          unselectArea={unselectHOLCPolygon}
          zoomToArea={() => false}
        />
      )}
      { (adData) ? (
        <FormComponent
          adData={adData}
          //selectCategory={selectCategory}
        />
      ) : (
        <p className="explanation">
        </p>
      )}
    </div>
  );
}


export default AreaDescription;

AreaDescription.propTypes = {
  FormComponent: PropTypes.func,
  formId: PropTypes.number,
};

AreaDescription.defaultProps = {
  FormComponent: undefined,
  formId: undefined,
  showHeader: true,
};
