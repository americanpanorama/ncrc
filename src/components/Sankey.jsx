import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import * as d3sankey from 'd3-sankey';
import './Sankey.css';

const Sankey = (props) => {
  const {
    nodes,
    links,
    hoveredArea,
    selectedArea,
    selectedCity,
    onHoverHOLCPolygon,
    onUnhoverHOLCPolygon,
    selectHOLCPolygon,
    onHoverTract,
    onUnhoverTract,
    selectTract,
    hoveredTract,
    selectedTract,
  } = props;

  const width = window.innerWidth * 0.25;
  const height = (window.innerHeight - 50);

  d3.sankey = d3sankey;

  const colorScaleTracts = d3.scaleLinear()
    .range(['white', '#FFA500'])
    .domain([0, 1]);

  const colorScaleHOLC = d3.scaleOrdinal()
    .range(['#d9838d', '#ffff00', '#7cb5bd', '#76a865'])
    .domain(['D', 'C', 'B', 'A']);

  const svY = d3.scaleLinear()
    .range([0, height - 50])
    .domain([0, 1]);

  // const pathColor = (holc_grade, income_lev) => {
  //   if (holc_grade === 'A') {
  //     if (income_lev === 4) {
  //       return '#C8D2C5';
  //     }
  //   }
  //   if (holc_grade === 'B') {
  //     if (income_lev === 3) {
  //       return '#CAD5D7';
  //     }
  //   }
  //   if (holc_grade === 'C') {
  //     if (income_lev === 2) {
  //       return '#E4E4B1';
  //     }
  //   }
  //   if (holc_grade === 'D') {
  //     if (income_lev < 2) {
  //       return '#DCCBCD';
  //     }
  //   }

  //   return 'silver';
  // }

  const sankey = d3sankey.sankey()
    .nodeId(d => d.id)
    .nodeSort((a, b) => {
      const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
      if (a.type === 'holc' && b.type === 'holc') {
        return collator.compare(a.sortValue, b.sortValue);
      }

      if (a.type === 'tract' && b.type === 'tract') {
        return a.sortValue - b.sortValue;
      }

      return 0
    })
    .linkSort((a, b) => {
      if (a.source.id === b.source.id) {
        return a.target.y0 - b.target.y0;
      }
      if (a.target.id === b.target.id) {
        return b.source.y0 - a.source.y0;
      }
      return 0;
    })
    .nodePadding([0])
    .nodeWidth([36])
    .size([width, height - 50]);

  let graph = sankey({nodes: nodes, links: links});

  graph.nodes.forEach((n, nIdx) => {
    if (n.type === 'tract') {
      const height = n.y1 - n.y0;
      nodes[nIdx].y0 = svY(n.sortValue);
      nodes[nIdx].y1 = svY(n.sortValue) + height;
    }
  });

  graph = sankey.update(graph);

  const rectFillOpacity =  (n) => {
    if (!hoveredArea && !selectedArea && !hoveredTract && !hoveredArea) {
      return 1;
    }
    if (n.type === 'holc') {
      if (n.id === hoveredArea || n.id === selectedArea) {
        return 1;
      } else if (hoveredArea || selectedArea) {
        return 0.2;
      }
      if (hoveredTract || selectedTract) {
        const targetedAreas = links
          .filter(l => l.target.id === hoveredTract || l.target.id === selectedTract)
          .map(l => l.source.id);
        if (targetedAreas.includes(n.id)) {
          return 1;
        } else {
          return 0.2;
        }
      }
    }
    if (n.type === 'tract') {
      if (n.id === hoveredTract || n.id === selectedTract) {
        return 1;
      } else if (hoveredTract || selectedTract) {
        return 0.2;
      }
      if (hoveredArea || selectedArea) {
        const targetedTracts = links
          .filter(l => l.source.id === hoveredArea || l.source.id === selectedArea)
          .map(l => l.target.id);
        if (targetedTracts.includes(n.id)) {
          return 1;
        } else {
          return 0.2;
        }
      }
    }
    return 1;
  };

  // const linkOpacity = (l) => {
  //   if (hoveredArea || selectedArea) {
  //     if (l.source.id === hoveredArea || l.source.id === selectedArea) {
  //       return 0.7;
  //     } else {
  //       return 0.025;
  //     }
  //   }

  //   return 0.3;
  // }

  const getPathOpacity = (l) => {
    if (!hoveredArea && !hoveredTract) {
      return 0.2;
    }
    if (hoveredArea === l.source.id || hoveredTract === l.target.id) {
      return 0.9;
    }
    return 0.05;
  };

  const paths = graph.links.map(l => {
    return {
      d: d3sankey.sankeyLinkHorizontal()(l),
      width: l.width,
      stroke: `url(#${l.holc_grade}-to-${l.sovi})`,
      strokeOpacity: getPathOpacity(l),
      key: `path${l.source.id}to${l.target.id}`,
    };
  });

  const rects = graph.nodes.map(n => ({
    x: n.x0,
    y: n.y0,
    width: n.x1 - n.x0,
    height: n.y1 - n.y0,
    fill: (n.type === 'holc') ? colorScaleHOLC(n.sortValue.charAt(0)) : colorScaleTracts(n.sortValue),
    fillOpacity: rectFillOpacity(n), 
    key: n.id,
    id: (n.type === 'holc') ? `${selectedCity}-${n.id}` : n.id,
    type: n.type,
    label: n.id.replace(`${selectedCity}-`, ''),
  }));

  const sovis = [...new Set(nodes.filter(n => n.type === 'tract').map(n => n.sortValue))];

  return (
    <div id='sankeyDiagram'>
      <svg
        width={width}
        height={height}
      >

        <defs>
          <linearGradient
            id='soviGradient'
            x1={0}
            x2={0}
            y1={0}
            y2={1}
          >
            <stop
              offset='0%'
              stopColor='white'
            />
            <stop
              offset='100%'
              stopColor='#FFA500'
            />
          </linearGradient>
          {['A', 'B', 'C', 'D'].map(grade => (
            <React.Fragment
              key={`defsFor${grade}`}
            >
              {sovis.map(sovi => (
                <linearGradient
                  id={`${grade}-to-${sovi}`}
                  key={`defFor${grade}to${sovi}`}
                >
                  <stop
                    offset='35%'
                    stopColor={colorScaleHOLC(grade)}
                  />
                  <stop
                    offset='65%'
                    stopColor={colorScaleTracts(sovi)}
                  />
                </linearGradient>
              ))}
            </React.Fragment>
          ))}
        </defs>

        <text
          x={2}
          y={45}
        >
          <tspan
            dy={-15}
            x={2}
          >
            HOLC
          </tspan>
          <tspan
            x={2}
            dy={15}
          >
            grades
          </tspan>
        </text>

        <text
          y={45}
          textAnchor='end'
        >
          <tspan
            dy={-15}
            x={width - 2}
          >
            census
          </tspan>
          <tspan
            x={width - 2}
            dy={15}
          >
            tracts
          </tspan>
        </text>

        <text
          x={width / 2}
          y={45}
          textAnchor='middle'
        >
          <tspan
            dy={-15}
            x={width / 2}
          >
            ← 1930s grades &
          </tspan>
          <tspan
            x={width / 2}
            dy={15}
          >
            current social vulnerability score →
          </tspan>
        </text>

         <rect
            x={width - 18}
            y={50}
            width={18}
            height={height}
            fill='url(#soviGradient)'
            fillOpacity={0.5}
          />

         


        <g transform='translate(0, 50)'>
          {paths.map(path => (
            <path
              d={path.d}
              fill='transparent'
              fillOpacity={0.2}
              stroke={path.stroke}
              strokeOpacity={path.strokeOpacity}
              strokeWidth={path.width}
              key={path.key}
            />
          ))}

          {rects.map(n => (
            <rect
              x={n.x}
              y={n.y + 0.25}
              width={n.width}
              height={n.height - 0.5}
              fill={n.fill}
              fillOpacity={n.fillOpacity}
              key={n.key}
              id={n.id}
              onClick={(n.type === 'holc') ? selectHOLCPolygon : selectTract}
              onMouseEnter={(n.type === 'holc') ? onHoverHOLCPolygon : onHoverTract}
              onMouseLeave={(n.type === 'holc') ? onUnhoverHOLCPolygon : onUnhoverTract}
            />
          ))}

          {rects
            .filter(n => n.type === 'holc' && n.height >= 10)
            .map(n => (
              <text
                x={18}
                y={n.y + n.height / 2 + 4}
                stroke='transparent'
                
                fontSize={10}
                textAnchor='middle'
                style={{
                  fill: 'black',
                  pointerEvents: 'none',
                }}
                key={`labelFor${n.label}`}
              >
                {n.label}
              </text>
            ))
          }

          <text
            x={width-2}
            y={12}
            textAnchor='end'
            className='svValue'
          >
            0
          </text>

          {[0.25, 0.5, 0.75].map(value => (
            <g key={`svValue=${value}`}>
              <text
                x={width-2}
                y={(height - 50) * value - 5 + 50}
                textAnchor='end'
                stroke={colorScaleTracts(value)}
                fontSize={12}
                strokeWidth={3}
                strokeOpacity={0.9}
              >
                {value}
              </text>
              <text
                x={width-2}
                y={(height - 50) * value - 5 + 50}
                textAnchor='end'
                className='svValue'
              >
                {value}
              </text>
            </g>
          ))}

          <text
            x={width-2}
            y={height - 50 - 5}
            textAnchor='end'
            className='svValue'
          >
            1
          </text>
        </g>
      </svg>
    </div>
  );
};

export default Sankey;

Sankey.propTypes = {
  nodes: PropTypes.array.isRequired,
  links: PropTypes.array.isRequired,
};

Sankey.defaultProps = {

};
