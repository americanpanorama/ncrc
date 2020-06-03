import React from 'react';
import PropTypes from 'prop-types';

const AreaButton = ({ category, label, direction, selectCategory }) => {
  if (!category) {
    return null;
  }

  return (
    <svg
      width={40}
      height={40}
      viewBox="-20 -20 40 40"
      onClick={selectCategory}
      id={category}
      className={`adButton category ${direction}`}
    >
      <circle
        cx={0}
        cy={0}
        r={17}
      />
      <text
        x={0}
        y={5}
      >
        {(direction === 'previous') ? `${label}` : `${label}`}
      </text>
    </svg>
  )
};


export default AreaButton;

AreaButton.propTypes = {
  category: PropTypes.string,
  label: PropTypes.string,
  direction: PropTypes.string,
  selectCategory: PropTypes.func.isRequired,
};

AreaButton.defaultProps = {
  category: null,
  label: null,
  direction: 'next',
};
