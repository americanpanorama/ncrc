import React from 'react';
import PropTypes from 'prop-types';

import HeaderArea from '../presentational/HeaderArea.jsx';
import TranscriptionButton from '../containers/TranscriptionButton';
import ViewAllADsButton from '../containers/ViewAllADsButton';
import ImageButton from '../containers/ImageButton';
import useFetch from '../../useFetch.js';
import './AreaDescription.css';

const AreaDescription = ({ selectedArea, selectedCity, filePath, FormComponent, formId }) => {
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
  console.log(adData);
  return (
    <div id="areaDescription">
      <HeaderArea
        holcId={selectedArea}
        adId={selectedCity}
        name={(adData.name) ? adData.name : null}
        unselectArea={() => false}
        zoomToArea={() => false}
      />
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
};
