import React from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, GeoJSON } from 'react-leaflet';

const AreaPolygons = ({ polygons, selectHOLCPolygon, unselectHOLCPolygon, onHoverHOLCPolygon, onUnhoverHOLCPolygon }) => {
  return (
    <LayerGroup>
      { polygons.map(p => (
        <GeoJSON
          data={p.area_geojson}
          className="neighborhoodPolygon"
          onClick={(p.isSelected) ? unselectHOLCPolygon : selectHOLCPolygon}
          onMouseOver={onHoverHOLCPolygon}
          onMouseOut={onUnhoverHOLCPolygon}
          id={`${p.ad_id}-${p.id}`}
          // color={p.strokeColor}
          fillColor={'transparent'}
          // fillOpacity={0.3}
          // opacity={p.strokeOpacity}
          weight={0}
          // style={p.style}
          key={`${p.ad_id}-${p.id}`}
        />
      ))}
    </LayerGroup>
  );
};

export default AreaPolygons;

AreaPolygons.propTypes = {
  polygons: PropTypes.arrayOf(PropTypes.object),
  selectHOLCPolygon: PropTypes.func.isRequired,
  unselectHOLCPolygon: PropTypes.func.isRequired,
  // unselectArea: PropTypes.func.isRequired,
  // highlightArea: PropTypes.func.isRequired,
  // unhighlightArea: PropTypes.func.isRequired,
};

AreaPolygons.defaultProps = {
  polygons: [],
};
