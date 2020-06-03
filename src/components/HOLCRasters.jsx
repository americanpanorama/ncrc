import React from 'react';
import PropTypes from 'prop-types';
import { TileLayer } from 'react-leaflet';

const HOLCRasters = ({ map }) => (
  <TileLayer
    className="holcRaster"
    url={map.url}
    minZoom={map.minZoom}
    maxNativeZoom={map.maxZoom - 1}
    maxZoom={24}
    bounds={map.bounds}
    zIndex={map.zIndex}
    key={`holcRaster-${map.id}`}
    detectRetina
  />
);

export default HOLCRasters;

HOLCRasters.propTypes = {
  maps: PropTypes.arrayOf(PropTypes.object),
};

HOLCRasters.defaultProps = {
  maps: [],
};
