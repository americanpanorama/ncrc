import React from 'react';
import useFetch from './components/useFetch.js';
import Masthead from './components/Masthead.js';
import Search from './components/Search.js';
import HOLCMap from './components/HOLCMap.js';
import SVMap from './components/SVMap.js';
import SankeyDiagram from './components/Sankey.js';
import AreaDescription from './components/AreaDescription/containers/AreaDescription.js';
import HOLCAreaData from './components/HOLCAreaData.js';
import TractData from './components/TractData.js';
import './App.css';
import './AppLayout.css';

const App = ({ selectedTract, selectedArea, holcPolygonsFilePath, cityFilePath, mappingInequalityLink }) => {
  const resHOLCPolygons = useFetch(`./static/polygons/${cityFilePath}`, {headers: { accept: "application/json" }});
  const resTractPolygons = useFetch(`./static/citiesContemporary/${cityFilePath}`, {headers: { accept: "application/json" }});
  const resHOLCAreasContemporary = useFetch(`./static/holcAreasContemporary/${cityFilePath}`, {headers: { accept: "application/json" }});
  const resIntersectionsPolygons = useFetch(`./static/intersections/${cityFilePath}`, {headers: { accept: "application/json" }});
  //console.log(resHOLCPolygons.response || !resTractPolygons.response || !resHOLCAreasContemporary || !resIntersectionsPolygons.response);
  if (!resHOLCPolygons.response || !resTractPolygons.response || !resHOLCAreasContemporary || !resIntersectionsPolygons.response) {
    return null;
  }
  const holcPolygons = resHOLCPolygons.response.polygons;
  const tractPolygons = resTractPolygons.response.polygons;
  const holcAreasContemporary = resHOLCAreasContemporary.response.polygons;
  //const intersectionPolygons = resIntersectionsPolygons.response.polygons;
  const { nodes: intersectionsNodes, links: intersectionsLinks } = resIntersectionsPolygons.response.sankey_data;

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

      {(selectedArea) && (
        <React.Fragment>
          <h3 id='thirtiesLabel'>
            ← The 1930s
          </h3>
          <h3 id='todayLabel'>
            Today →
          </h3>

          <div id='thirtiesData'>
            <AreaDescription />
            {(selectedArea) && (
              <div className='miLink'>
                <a
                  href={`${mappingInequalityLink}&area=${selectedArea.split('-')[1]}`}
                  target='_blank'
                >
                  Explore the full area description on <cite>Mapping Inequality</cite>
                </a>
              </div>
            )}
          </div>
          <div id='todayData'>
            <TractData
              selectedTract={selectedArea.split('-')[1]}
              tractData={holcAreasContemporary}
            />
          </div>
        </React.Fragment>
      )}


      {(selectedTract) && (
        <React.Fragment>
          <h3 id='thirtiesLabel'>
            ← The 1930s
          </h3>
          <h3 id='todayLabel'>
            Today →
          </h3>

          <div id='thirtiesData'>
            <HOLCAreaData
              overlappingAreas={tractPolygons.find(tp => tp.id === selectedTract).holc_ids}
             />
          </div>
          <div id='todayData'>
            <TractData 
              selectedTract={selectedTract}
              tractData={tractPolygons}
            />
          </div>
        </React.Fragment>
      )}

      {(!selectedArea && !selectedTract) && (
        <SankeyDiagram 
          nodes={intersectionsNodes}
          links={intersectionsLinks}
        />
      )}





    </div>
  );
}

export default App;
