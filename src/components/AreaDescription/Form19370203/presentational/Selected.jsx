import React from 'react';
import PropTypes from 'prop-types';
import SimpleCategory from '../../containers/SimpleCategory';
import SimpleSubcategory from '../../containers/SimpleSubcategory';
import EmptyField from '../../presentational/EmptyField';

const Form19370203Curated = ({ adData }) => (
  <ul>
    <li>
      <span className="catNum">
        5
      </span>
      <span className="catName">
        Inhabitants
      </span>
      <ul>
        <SimpleSubcategory
          data={adData['5'].e}
          num={5}
          letter="e"
          name="Infiltration of"
        />
        <SimpleSubcategory
          data={adData['5'].f}
          num={5}
          letter="f"
          name="Relief families"
        />
        <li>
          <span
            className="catLetter catSelectable"
            id="5-c"
          >
            c
          </span>
          <span
            className="subcatName catSelectable"
            id="5-c"
          >
            Foreign-born
          </span>
          <span className="subcatData">
            {(adData[5] && adData[5].c['1'])
              ? adData[5].c['1']
              : <EmptyField />
            }
            ;
            { (adData[5] && adData[5].c['2'])
              ? adData[5].c['2']
              : <EmptyField />
            }
          </span>
        </li>
        <li>
          <span
            className="catLetter catSelectable"
            id="5-d"
          >
            d
          </span>
          <span
            className="subcatName catSelectable"
            id="5-d"
          >
            Negro
          </span>
          <span
            className="subcatData"
          >
            {(adData[5] && adData[5].d['1'])
              ? adData[5].d['1']
              : <EmptyField />
            }
            ;
            {(adData[5] && adData[5].d['2'])
              ? adData[5].d['2']
              : <EmptyField />
            }
          </span>
        </li>
        <SimpleSubcategory
          data={adData['5'].a}
          num={5}
          letter="a"
          name="Type"
        />
        <SimpleSubcategory
          data={adData['5'].b}
          num={5}
          letter="b"
          name="Estimated annual family income"
        />
      </ul>
    </li>
    <SimpleCategory
      data={adData['14']}
      num={14}
      name="Clarifying Remarks"
    />
    <SimpleCategory
      data={adData['3']}
      num={3}
      name="Favorable Influences"
    />
    <SimpleCategory
      data={adData['4']}
      num={4}
      name="Detrimental Influences"
    />
    <SimpleCategory
      data={adData['2']}
      num={2}
      name="Description of Terrain"
    />
  </ul>
);

Form19370203Curated.propTypes = {
  adData: PropTypes.object.isRequired,
};

export default Form19370203Curated;
