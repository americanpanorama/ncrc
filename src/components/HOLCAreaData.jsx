import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './HOLCAreaData.css';
import AreaDescription from './AreaDescription/containers/AreaDescriptionTractSelected.js';

const HOLCAreaData = ({ overlappingAreas, selectedTract, mappingInequalityLink, selectHOLCPolygon }) => {
  var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  const sortedAreas = overlappingAreas.sort((a, b) => collator.compare(a.holc_id, b.holc_id));
  const largestArea = sortedAreas.reduce((current, area) => (area.tract_prop > current.tract_prop) ? area : current);
  const [selectedArea, setSelectedArea] = useState(largestArea.holc_id);

  // set the selectedArea when a new tract is selected
  useEffect(() => {
    setSelectedArea(largestArea.holc_id);
  }, [selectedTract]);

  const colors = {D: '#d9838d', C: '#ffff00', B: '#7cb5bd', A: '#76a865'};

  // calculate the overlap of all areas
  const totalTractProp = overlappingAreas.reduce((acc, area) => acc + area.tract_prop, 0);

  return (
    <div id='holcAreaData'>
      <ul 
        className='tabs'
      >
        {sortedAreas.map(area => (
          <li
            key={area.holc_id}
            onClick={() => setSelectedArea(area.holc_id)}
            style={{
              width: `calc(${area.tract_prop * 22.5 * 1 / totalTractProp}vw - 1px)`,
              backgroundColor: colors[area.holc_id.charAt(0)],
              borderRight: '0.5px solid black',
              borderBottom: (area.holc_id === selectedArea) ? '4px solid black' : '4px solid #eee',
              borderTop: (area.holc_id === selectedArea) ? '4px solid black' : '4px solid #eee',
              color: (area.tract_prop * 1 / totalTractProp > 0.1) ? 'black' : 'transparent'
            }}
          >
            {area.holc_id}
          </li>
        ))}
      </ul>

      <AreaDescription
        selectedArea={selectedArea}
        showHeader={false}
      />

      {(selectedArea) && (
        <div className='miLink'>
          <a
            href={`${mappingInequalityLink}&area=${selectedArea}`}
            target='_blank'
          >
            Explore the full area description for {selectedArea} on <cite>Mapping Inequality</cite>
          </a>
        </div>
      )}
    </div>
  );
};

export default HOLCAreaData;

HOLCAreaData.propTypes = {
  overlappingAreas: PropTypes.array.isRequired,
};

HOLCAreaData.defaultProps = {

};
