import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import BeeswarmGraph from './BeeswarmGraph.js';
import Close from './Buttons/presentational/Close.jsx';
import './TractData.css';

const TractData = ({ selectedTract, unselectTract, tractData }) => {
  if (!tractData) {
    return null;
  }

  //const { id, holc_id, shape_area, cbsa_quartiles, national_quartile, disinvestment_score, stroke_pct, obesity_pct, mental_health_pct, kidney_pct, diabetes_pct, copd_pct, chd_pct, asthma_pct, cancer_pct, highbp_pct, life_exp, access_pct, sovi, poverty_pct, no_internet_pct, insured_pct, over65_pct, median_age, minority_pct, pop_num, income_level, shape_length} = tractData.find(tp => tp.id === selectedTract);
  const { id, pop_num } = tractData.find(tp => tp.id === selectedTract);

  //A color scale
  // const colorScale = d3.scaleLinear()
  //   //.range(['#d9838d', '#d9838d', '#ffff00', '#7cb5bd', '#76a865'])
  //   .range(['#FB2B11', '#faed27', '#15f4ee', '#39ff14'])
  //   .domain([4, 3, 2, 1]);

  const minValue = 0;
  const maxValue = 1;
  const rangeValue = 1;
  //A color scale
  const colorScale = d3.scaleLinear()
    //.range(['#d9838d', '#d9838d', '#ffff00', '#7cb5bd', '#76a865'])
    .range(['white', '#FFA500'])
    .range(['#59E854', '#2F960D', '#0D440E', '#EFD507', '#EC0003', '#FF0093'])
    //.domain([1, 0.66, 0.33, 0]);
    .domain([minValue, minValue + rangeValue * 0.2, minValue + rangeValue * 0.4,  minValue + rangeValue * 0.6, minValue + rangeValue * 0.8, maxValue]);


  const getPercents = (param) => tractData
    .filter(d => d[param])
    .map(d => ({
      id: d.id,
      value: d[param],
      fill: colorScale(d.sovi),
    })
  );

  return (
    <div className='tractData'>
      {(selectedTract) && (
        <button
          onClick={unselectTract}
          tabIndex={0}
        >
          Close
        </button>
      )}

      <BeeswarmGraph
        data={getPercents('sovi')}
        param='sovi'
        selected={selectedTract}
        label='Social Vulnerability Index'
      />

      <h3>Demographics</h3>
      <div>
        {`Population: ${pop_num}`}
      </div>
      

      <BeeswarmGraph
        data={getPercents('minority_pct')}
        param='minority_pct'
        selected={selectedTract}
        label='Percent Minority'
        type='percent'
      />

      <BeeswarmGraph
        data={getPercents('life_exp')}
        param='life_exp'
        selected={selectedTract}
        label='Life Expectancy'
      />

      <BeeswarmGraph
        data={getPercents('median_age')}
        param='median_age'
        selected={selectedTract}
        label='Median Age'
      />

      <BeeswarmGraph
        data={getPercents('over65_pct')}
        selected={selectedTract}
        label='Over 65'
        type='percent'
      />

      <BeeswarmGraph
        data={getPercents('poverty_pct')}
        param='poverty_pct'
        selected={selectedTract}
        label='Poverty'
        type='percent'
      />

      <BeeswarmGraph
        data={getPercents('insured_pct')}
        param='insured_pct'
        selected={selectedTract}
        label='Insured'
        type='percent'
      />
      
      <BeeswarmGraph
        data={getPercents('no_internet_pct')}
        param='no_internet_pct'
        selected={selectedTract}
        label='Without Internet'
        type='percent'
      />

      <h3>Disease and Health Conditions</h3>

      <BeeswarmGraph
        data={getPercents('asthma_pct')}
        selected={selectedTract}
        label='Asthma'
        type='percent'
      />

      <BeeswarmGraph
        data={getPercents('cancer_pct')}
        param='cancer_pct'
        selected={selectedTract}
        label='Cancer'
        type='percent'
      />


      <BeeswarmGraph
        data={getPercents('diabetes_pct')}
        param='diabetes_pct'
        selected={selectedTract}
        label='Diabetes'
        type='percent'
      />

      <BeeswarmGraph
        data={getPercents('highbp_pct')}
        param='highbp_pct'
        selected={selectedTract}
        label='High Blood Pressure'
        type='percent'
      />

      <BeeswarmGraph
        data={getPercents('kidney_pct')}
        param='kidney_pct'
        selected={selectedTract}
        label='Kidney Disease'
        type='percent'
      />

      <BeeswarmGraph
        data={getPercents('mental_health_pct')}
        param='mental_health_pct'
        selected={selectedTract}
        label='Mental Health Problems'
        type='percent'
      />

      <BeeswarmGraph
        data={getPercents('obesity_pct')}
        param='obesity_pct'
        selected={selectedTract}
        label='Obesity'
        type='percent'
      />

      <BeeswarmGraph
        data={getPercents('copd_pct')}
        param='ocpd_pct'
        selected={selectedTract}
        label='Pulmonary Disease'
        type='percent'
      />
    </div>
  );
};

export default TractData;

TractData.propTypes = {
  tractData: PropTypes.array.isRequired,
};

TractData.defaultProps = {

};
