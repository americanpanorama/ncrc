import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { beeswarm } from 'd3-beeswarm';
import './BeeswarmGraph.css';

const BeeswarmGraph = ({ data, selected, label, type, param, selectedView, selectedADId, select, onUnhover, onHover, selectTractView }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.filter(d => d.value).map(d => Math.round(d.value * 10) / 10));
  const minValue = Math.min(...data.filter(d => d.value).map(d => Math.round(d.value * 10) / 10));
  const width = window.innerWidth / 4 - 40;

  // set the radius based on the number of area
  const radius = Math.min(4, Math.max(1, 450 / data.length));

  const xScale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([10, width - 10]);

  let swarm = beeswarm()
    .data(data)                                 // set the data to arrange
    .distributeOn(d => xScale(d.value))                  // set the value accessor to distribute on
    .radius(radius * 4 / 3)                                  // set the radius for overlapping detection
    .orientation('horizontal')                  // set the orientation of the arrangement
                                                  // could also be 'vertical'
    .side('symetric')                           // set the side(s) available for accumulation
                                                  // could also be 'positive' or 'negative'
    .arrange();

  // determine the necessary height of the graph
  const beeswarmHeight = Math.max(...swarm.map(d => Math.abs(d.y))) * 2 + radius * 2;

  const selectedTractData = swarm.find(d => d.datum.id === selected);

  let valueTextAnchor = 'middle';
  if (selectedTractData && selectedTractData.x < 30) {
    valueTextAnchor = 'start'
  } else if (selectedTractData && width - selectedTractData.x < 30) {
    valueTextAnchor = 'end'
  }

  return (
    <svg
      width={width}
      height={beeswarmHeight + 20}
      className='beeswarm'
    >
      {swarm.map(tract => (
        <circle
          cx={tract.x}
          cy={tract.y + beeswarmHeight / 2 + 20}
          r={(tract.datum.id === selected) ? radius * 4 / 3 : radius}
          fill={tract.datum.fill}
          strokeWidth={(tract.datum.id === selected) ? 1 : 0.25}
          stroke={(tract.datum.id === selected) ? 'black' : '#555'}
          fillOpacity={(tract.datum.id === selected) ? 1 : 0.2}
          key={tract.datum.id}
          onClick={select}
          onMouseOver={onHover}
          onMouseOut={onUnhover}
          id={tract.datum.id}
        />
      ))}

      {/* the axis */}
      <g transform={`translate(0 0)`}>

        <line
          x1={5}
          y1={18}
          x2={width - 5}
          y2={18}
          stroke='#777'
        />

        <text
          x={5}
          y={15}
          fontSize={12}
          fill='#666'
        >
          {(type === 'percent') ? `${minValue}%` : minValue.toLocaleString()}
        </text>
        <text
          x={width - 5}
          y={15}
          fontSize={12}
          textAnchor='end'
          fill='#666'
        >
          {(type === 'percent') ? `${maxValue}%` : maxValue.toLocaleString()}
        </text>

        <text
          x={width / 2}
          y={15}
          fontSize={14}
          textAnchor='middle'
          onClick={(param) ? selectTractView : () => false}
          id={param}
        >
          {`${label}${(param) ? ' (map→)' : ''}`}
        </text>
      </g>

      {(selectedTractData) && (
        <g>
          <text
            x={selectedTractData.x}
            y={33}
            textAnchor={valueTextAnchor}
            fontSize={13}
            stroke='white'
            strokeWidth={3}
            strokeOpacity={0.5}
          >
            {(type === 'percent') ? `${Math.round(selectedTractData.datum.value * 10) / 10}%` : selectedTractData.datum.value.toLocaleString()}
          </text>
          <text
            x={selectedTractData.x}
            y={33}
            textAnchor={valueTextAnchor}
            fontSize={13}
          >
            {(type === 'percent') ? `${Math.round(selectedTractData.datum.value * 10) / 10}%` : selectedTractData.datum.value.toLocaleString()}
          </text>
        </g>
      )}
    </svg>
  );
};

export default BeeswarmGraph;

BeeswarmGraph.propTypes = {
  data: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
};

BeeswarmGraph.defaultProps = {
};
