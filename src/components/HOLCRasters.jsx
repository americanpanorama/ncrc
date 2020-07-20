import React from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, TileLayer } from 'react-leaflet';

const HOLCRasters = ({ maps }) => (
  <LayerGroup>
    {maps.map(map => (
      <TileLayer
        className="holcRaster"
        url={map.url}
        minZoom={map.minZoom}
        maxNativeZoom={map.maxZoom - 1}
        maxZoom={24}
        bounds={map.bounds}
        zIndex={map.zIndex}
        detectRetina
        key={`raster${map.id}`}
      />
    ))}
  </LayerGroup>
);

export default HOLCRasters;

HOLCRasters.propTypes = {
  maps: PropTypes.arrayOf(PropTypes.object),
};

HOLCRasters.defaultProps = {
  maps: [],
};
