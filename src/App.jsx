import React, { useState } from 'react';
import Masthead from './components/Masthead.js';
import Search from './components/Search.js';
import HOLCMap from './components/HOLCMap.js';
import SVMap from './components/SVMap.js';
import AreaDescription from './components/AreaDescription/containers/AreaDescription.js';
import useFetch from './components/useFetch.js';
import './App.css';
import './AppLayout.css';

const App = ({holcPolygonsFilePath}) => {
  const resHOLCPolygons = useFetch(`./static/polygons/${holcPolygonsFilePath}`, {headers: { accept: "application/json" }});
  const resTractPolygons = useFetch(`./static/citiesContemporary/${holcPolygonsFilePath}`, {headers: { accept: "application/json" }});
  if (!resHOLCPolygons.response || !resTractPolygons.response) {
    return null;
  }
  const holcPolygons = resHOLCPolygons.response.polygons;
  const tractPolygons = resTractPolygons.response.polygons;

  return (
    <div className="App">
      <Masthead />
      <Search />
      <HOLCMap
        holcPolygons={holcPolygons}
        tractPolygons={tractPolygons}
      />
      <SVMap
        holcPolygons={holcPolygons}
        tractPolygons={tractPolygons}
      />

      <h3 id='thirtiesLabel'>
        ← The 1930s
      </h3>
      <h3 id='todayLabel'>
        Today →
      </h3>

      <div id='thirtiesData'>
        <AreaDescription />
      </div>
      <div id='todayData'>
        comparable data about tract(s)
      </div>




    </div>
  );
}

export default App;
