import React, { useRef }  from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';
import MapboxGlLayer from "next-react-mapbox-gl-leaflet";
import './SVMap.css';

import TheStore from '../store';
import { updateMap } from '../store/Actions';

const SVMap = (props) => {
  const {
    zoom,
    center,
    clickOnMap,
    holcPolygons,
    tractPolygons,
    selectedArea,
    hoveredArea,
    hoveredTract,
    selectedTract,
    selectedTractView,
    selectTract,
    onHoverTract,
    onUnhoverTract,
  } = props;

  const ref = useRef(null);

  // handle holc area hover, the inverted polygon and the tiles to get
  // const parseInvertedGeoJson = (geojson) => {
  //   //Create a new set of latlngs, adding our world-sized ring first
  //   let NWHemisphere = [[0,0], [0, 90], [-180, 90], [-180, 0], [0,0]],
  //     newLatLngs = [ NWHemisphere ],
  //     holes =[];

  //   geojson.coordinates.forEach((polygon, i) => {
  //     polygon.forEach((polygonpieces, i2) => {
  //       if (i2 == 0) {
  //         newLatLngs.push(polygonpieces);
  //       } else {
  //         holes.push(polygonpieces);
  //       }
  //     });
  //   });
  //   const coordinates = (holes.length > 0) ? [newLatLngs.concat(holes)] : [newLatLngs]
  //   return {
  //     ...geojson,
  //     coordinates,
  //   };
  // };
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

  // filter to remove duplicates
  // let tracts = cityData.features.filter((ct, index, self) => {
  //   return index === cityData.features.findIndex((ct2) => ct.properties.id === ct2.properties.id)
  // });




  const maxForView = Math.max(...tractPolygons.map(ct => ct[selectedTractView]));
  const minForView = Math.min(...tractPolygons.filter(ct => ct[selectedTractView] > 0).map(ct => ct[selectedTractView]));
  const rangeForView = maxForView - minForView;

  // const fillOpacity = d3.scaleLinear()
  //   .range([0.05, 0.5])
  //   .domain([0, maxPopulationDensity]);

  //A color scale
  // const colorScaleHOLC = d3.scaleLinear()
  //   //.range(['#d9838d', '#d9838d', '#ffff00', '#7cb5bd', '#76a865'])
  //   .range(['#FB2B11', '#faed27', '#15f4ee', '#39ff14'])
  //   .domain([4, 3, 2, 1]);

    

  //A color scale
  const colorScale = d3.scaleLinear()
    //.range(['#d9838d', '#d9838d', '#ffff00', '#7cb5bd', '#76a865'])
    .range(['white', '#FFA500'])
    .range(['#59E854', '#2F960D', '#0D440E', '#EFD507', '#EC0003', '#FF0093'])
    //.domain([1, 0.66, 0.33, 0]);
    .domain([minForView, minForView + rangeForView * 0.2, minForView + rangeForView * 0.4,  minForView + rangeForView * 0.6, minForView + rangeForView * 0.8, maxForView]);

  // calculate styles
  const tracts = tractPolygons
    .filter((ct, index, self) => {
      return index === tractPolygons.findIndex((ct2) => ct.id === ct2.id)
    })
    .map(ct => {
      return {
        ...ct,
        fillOpacity: 0.33, //fillOpacity(ct.total_pers),
        fill: colorScale(ct[selectedTractView]),
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
          //style='mapbox://styles/ur-dsl/cjtyox5ms3ycd1flvhg7kihdi?key=cjtyox5ms3ycd1flvhg7kihdi'
          // eslint-disable-next-line
          style='mapbox://styles/ur-dsl/ckb2nhasn01ns1gqqnbcpd563'
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
            opacity={1}
            key={holcAreaTilesUrl}
          />
        ))}

        {(tracts.map(ct => (
          <GeoJSON
            data={ct.area_geojson}
            key={ct.id}
            fillColor={ct.fill}
            fillOpacity={ct.fillOpacity}
            weight={((selectedTract === ct.id) || (hoveredTract === ct.id)) ? 3 : 1}
            color={ct.fill}
            opacity={((selectedTract === ct.id) || (hoveredTract === ct.id)) ? 1 : (selectedTract) ? 0.2 : 0.5 }
            onClick={selectTract}
            onMouseOver={onHoverTract}
            onMouseOut={onUnhoverTract}
            id={ct.id}
          />
        )))}

        {selectedPolygonsGeojson.map(area => (
          <GeoJSON
            data={area.area_geojson}
            fillColor={'white'}
            fillOpacity={0}
            weight={3}
            color='#999'
            key={`selected-${area.neighborhoodId}`}
          />
        ))}
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
