import React, { useRef, useEffect }  from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';
import MapboxGlLayer from "next-react-mapbox-gl-leaflet";
import './SVMap.css';

import AreaPolygons from './AreaPolygons.jsx';

import TheStore from '../store';
import { updateMap } from '../store/Actions';

const SVMap = (props) => {
  const {
    zoom,
    center,
    clickOnMap,
    holcPolygons,
    tractPolygons,
    cityData,
    selectedArea,
    hoveredArea,
    selectedTract,
    selectedCity,
    selectTract,
    onHoverTract,
    onUnhoverTract,
  } = props;

  const ref = useRef(null);

  // handle holc area hover, the inverted polygon and the tiles to get
  let selectedPolygonGeojson;
  let holcAreaTilesUrl;
  const parseInvertedGeoJson = (geojson) => {
    //Create a new set of latlngs, adding our world-sized ring first
    let NWHemisphere = [[0,0], [0, 90], [-180, 90], [-180, 0], [0,0]],
      newLatLngs = [ NWHemisphere ],
      holes =[];

    geojson.coordinates.forEach((polygon, i) => {
      polygon.forEach((polygonpieces, i2) => {
        if (i2 == 0) {
          newLatLngs.push(polygonpieces);
        } else {
          holes.push(polygonpieces);
        }
      });
    });
    const coordinates = (holes.length > 0) ? [newLatLngs.concat(holes)] : [newLatLngs]
    return {
      ...geojson,
      coordinates,
    };
  };
  const holcAreaTilesUrls = [];
  const selectedPolygonsGeojson = []
  if (hoveredArea) {
    const selectedPolygonIdx = holcPolygons.findIndex(p => hoveredArea === `${p.ad_id}-${p.id}`);

    if (selectedPolygonIdx !== -1) {
      const { area_geojson, neighborhoodId } = holcPolygons[selectedPolygonIdx];
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

  // filter to remove duplicates
  // let tracts = cityData.features.filter((ct, index, self) => {
  //   return index === cityData.features.findIndex((ct2) => ct.properties.geoid === ct2.properties.geoid)
  // });

  const populationDensities = tractPolygons.map(ct => ct.total_pers / (ct.shape_area * 3.8610215854245e-7));
  const maxPopulationDensity = Math.max(...populationDensities);

  const fillOpacity = d3.scaleLinear()
    .range([0.05, 0.5])
    .domain([0, maxPopulationDensity]);

  //A color scale
  const colorScale = d3.scaleLinear()
    .range(['#d9838d', '#d9838d', '#ffff00', '#7cb5bd', '#76a865'])
    .domain([0, 1, 2, 3, 4]);

  // calculate styles
  const tracts = tractPolygons
    .filter((ct, index, self) => {
      return index === tractPolygons.findIndex((ct2) => ct.geoid === ct2.geoid)
    })
    .map(ct => {
      return {
        ...ct,
        fillOpacity: fillOpacity(ct.total_pers),
        fill: colorScale(ct.income_lev),
      };
    });


  const onMapMoved = () => {
    const { zoom: oldZoom, center: oldCenter, bounds: oldBounds } = props;
    const theMap = ref.current.leafletElement;
    const zoom = theMap.getZoom();
    const center = [theMap.getCenter().lat, theMap.getCenter().lng];
    const latLngBounds = theMap.getBounds();
    const bounds = [[latLngBounds.getNorthWest().lat, latLngBounds.getNorthWest().lng],
      [latLngBounds.getSouthEast().lat, latLngBounds.getSouthEast().lng]];
    // only dispatch if something has changed
    if (!oldBounds || oldBounds.length !== bounds.length
      || !oldBounds[0].every((value, index) => value === bounds[0][index])
      || !oldBounds[1].every((value, index) => value === bounds[1][index])
      || !oldCenter.every((value, index) => value === center[index])
      || oldZoom !== zoom) {
      TheStore.dispatch(updateMap({
        zoom,
        center,
        bounds,
      }));
    }
  }

  return (
    <div
      id='sv_map'
    >
      <Map
        zoom={zoom}
        center={center}
        ref={ref}
        key="the_map"
        id='holcLeafletMap'
        zoomControl={false}
        onMoveEnd={onMapMoved}
        padding={0.5}
        maxBounds={[[15, -170], [60, -41]]}
        onClick={clickOnMap}
      >
        <MapboxGlLayer
          accessToken="pk.eyJ1IjoidXItZHNsIiwiYSI6ImNqdGs3MHhxdDAwd2E0NHA2bmxoZjM1Y2IifQ.y1wfhup4U2U8KvHuOpFCng"
          style='mapbox://styles/ur-dsl/cjtyox5ms3ycd1flvhg7kihdi?key=cjtyox5ms3ycd1flvhg7kihdi'
          attribution={'© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'}
        />

      {/* JSX Comment
        <TileLayer
          className="areaRaster"
          url='https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
          zIndex={1000}
          detectRetina
          opacity={0.5}
        />  */}

        {holcAreaTilesUrls.map(holcAreaTilesUrl => (
          <TileLayer
            url={holcAreaTilesUrl}
            zIndex={1000}
            detectRetina
            opacity={0.5}
            key={holcAreaTilesUrl}
          />
        ))}

        {selectedPolygonsGeojson.map(area => (
          <GeoJSON
            data={area.area_geojson}
            fillColor={'white'}
            fillOpacity={0}
            weight={3}
            color='black'
            key={`selected-${area.neighborhoodId}`}
          />
        ))}

        {(tracts.map(ct => (
          <GeoJSON
            data={ct.area_geojson}
            key={ct.geoid}
            fillColor={ct.fill}
            fillOpacity={ct.fillOpacity}
            weight={(selectedTract === ct.geoid) ? 3 : 1}
            color={(selectedTract === ct.geoid) ? 'black' : '#999'}
            onClick={selectTract}
            onMouseOver={onHoverTract}
            onMouseOut={onUnhoverTract}
            id={ct.geoid}
          />
        )))}
      </Map>
    </div>
  );
}

export default SVMap;

SVMap.propTypes = {
  zoom: PropTypes.number.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  bounds: PropTypes.arrayOf(PropTypes.array),
};

SVMap.defaultProps = {
  bounds: undefined,
};
