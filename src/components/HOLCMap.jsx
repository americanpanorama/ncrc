import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import MapboxGlLayer from "next-react-mapbox-gl-leaflet";
import './HOLCMap.css';

import HOLCRasters from './HOLCRasters.js';
import AreaPolygons from './AreaPolygons.js';

import TheStore from '../store';
import { updateMap } from '../store/Actions';

const HOLCMap = (props) => {
  const {
    zoom,
    center,
    clickOnMap,
    holcPolygons,
    tractPolygons,
    className,
    selectedArea,
    hoveredArea,
    selectedTract,
    hoveredTract,
  } = props;

  const ref = useRef(null);

  const holcAreaTilesUrls = [];
  const selectedPolygonsGeojson = []
  if (hoveredArea) {
    const selectedPolygonIdx = holcPolygons.findIndex(p => hoveredArea === `${p.ad_id}-${p.id}`);

    if (selectedPolygonIdx !== -1) {
      const { neighborhoodId } = holcPolygons[selectedPolygonIdx];
      selectedPolygonsGeojson.push(holcPolygons[selectedPolygonIdx]);
      holcAreaTilesUrls.push(`//s3.amazonaws.com/holc/polygon_tiles/${neighborhoodId}/{z}/{x}/{y}.png`);
    }
  };
  if (selectedArea) {
    const selectedPolygonIdx = holcPolygons.findIndex(p => selectedArea === `${p.ad_id}-${p.id}`);

    if (selectedPolygonIdx !== -1) {
      const { neighborhoodId: nid } = holcPolygons[selectedPolygonIdx];
      selectedPolygonsGeojson.push(holcPolygons[selectedPolygonIdx]);
      holcAreaTilesUrls.push(`//s3.amazonaws.com/holc/polygon_tiles/${nid}/{z}/{x}/{y}.png`);
    }
  };
  if (selectedTract) {
    // get the overlapping ids
    const tp = tractPolygons.find(tp => tp.id === selectedTract);
    if (tp) {
      tp.holc_ids.forEach(overlappingHolcId => {
        const selectedPolygonIdx = holcPolygons.findIndex(p => overlappingHolcId.holc_id === p.id);

        if (selectedPolygonIdx !== -1) {
          const { neighborhoodId: nid } = holcPolygons[selectedPolygonIdx];
          selectedPolygonsGeojson.push(holcPolygons[selectedPolygonIdx]);
          holcAreaTilesUrls.push(`//s3.amazonaws.com/holc/polygon_tiles/${nid}/{z}/{x}/{y}.png`);
        }
      })
    }
  }

  const visibleTractPolygons = [];
  if (selectedTract) {
    const tp = tractPolygons.find(tp => tp.id === selectedTract);
    if (tp) {
      visibleTractPolygons.push(tp);
    }
  }
  if (hoveredTract && hoveredTract !== selectedTract) {
    const cth = tractPolygons.find(tp => tp.id === hoveredTract);
    if (cth) {
      visibleTractPolygons.push(cth);
    }
  }


  //A color scale
  // const colorScale = d3.scaleLinear()
  //   .range(['#d9838d', '#d9838d', '#ffff00', '#7cb5bd', '#76a865'])
  //   .domain([0, 1, 2, 3, 4]);

  const onMapMoved = () => {
    const { zoom: oldZoom, center: oldCenter, bounds: oldBounds } = props;
    const theMap = ref.current.leafletElement;
    const zoom = theMap.getZoom();
    const center = [theMap.getCenter().lat, theMap.getCenter().lng];
    const latLngBounds = theMap.getBounds();
    const bounds = [[latLngBounds.getNorthWest().lat, latLngBounds.getNorthWest().lng],
      [latLngBounds.getSouthEast().lat, latLngBounds.getSouthEast().lng]];
    // only dispatch if something has changed
    const precision = Math.max(1000, 10000 * Math.pow(10, zoom - 12));
    // console.log(precision, zoom);
    // if (oldBounds && oldBounds.length == 2) {
    //   console.log(oldBounds[0].map(d => Math.round(d * precision)));
    //   console.log(bounds[0].map(d => Math.round(d * precision)));
    // }
    if (!oldBounds || oldBounds.length !== bounds.length
      || !oldBounds[0].every((value, index) => Math.round(value * precision) === Math.round(bounds[0][index] * precision))
      || !oldBounds[1].every((value, index) => Math.round(value * precision) === Math.round(bounds[1][index] * precision))
      || !oldCenter.every((value, index) => Math.round(value * precision) === Math.round(center[index]) * precision)
      || oldZoom !== zoom) {
      TheStore.dispatch(updateMap({
        zoom,
        center,
        bounds,
      }));
    }
  }

  // const invertGeojson = (geojson) => {
  //   //Create a new set of latlngs, adding our world-sized ring first
  //   const NWHemisphere = [[0,0], [0, 90], [-180, 90], [-180, 0], [0,0]];
  //   const newLatLngs = [ NWHemisphere ];
  //   const holes =[];

  //   visibleTractPolygons.forEach(vtp => {
  //     geojson.coordinates.forEach((polygon, i) => {
  //       polygon.forEach((polygonpieces, i2) => {
  //         if (i2 == 0) {
  //           newLatLngs.push(polygonpieces);
  //         } else {
  //           holes.push(polygonpieces);
  //         }
  //       });
  //     });
  //   })
  //   return {
  //     ...geojson,
  //     coordinates: (holes.length > 0) ? [newLatLngs.concat(holes)] : [newLatLngs],
  //   };
  // };


  return (
    <div
      id='the_map'
    >
      <Map
        zoom={zoom}
        center={center}
        ref={ref}
        key="the_map"
        id='holcLeafletMap'
        className={className}
        zoomControl={false}
        onMoveEnd={onMapMoved}
        padding={0.5}
        maxBounds={[[15, -170], [60, -41]]}
        onClick={clickOnMap}
      >
        <MapboxGlLayer
          accessToken="pk.eyJ1IjoidXItZHNsIiwiYSI6ImNqdGs3MHhxdDAwd2E0NHA2bmxoZjM1Y2IifQ.y1wfhup4U2U8KvHuOpFCng"
          //style='mapbox://styles/ur-dsl/cjtyox5ms3ycd1flvhg7kihdi?key=cjtyox5ms3ycd1flvhg7kihdi'
          // eslint-disable-next-line
          style='mapbox://styles/ur-dsl/ckb2nhasn01ns1gqqnbcpd563'
          attribution={'© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'}
        />
        <HOLCRasters />

        {holcAreaTilesUrls.map(holcAreaTilesUrl => (
          <TileLayer
            url={holcAreaTilesUrl}
            zIndex={1000}
            detectRetina
            key={holcAreaTilesUrl}
          />
        ))}

      {/* JSX Comment
        {selectedPolygonsGeojson.map(area => (
          <GeoJSON
            data={area.area_geojson}
            fillColor={'white'}
            fillOpacity={0}
            weight={3}
            color='black'
            key={`selected-${area.neighborhoodId}`}
          />
        ))}  */}

        {visibleTractPolygons.map(ct => (
          <GeoJSON
           data={ct.area_geojson}
            key={ct.id}
            fillColor='silver'
            fillOpacity={0.15}
            weight={6}
            color='purple'
            id={ct.geoid}
          />
        ))}

        <AreaPolygons
          polygons={holcPolygons}
        />

      </Map>
    </div>
  );

};

export default HOLCMap;

HOLCMap.propTypes = {
  zoom: PropTypes.number.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  bounds: PropTypes.arrayOf(PropTypes.array),
};

HOLCMap.defaultProps = {
  bounds: undefined,
};
