import * as React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './Search.css';

const Search = ({options, selectCity}) => {

  const filterOption = ({ label, value }, string) => {
    // default search
    if (label.toLocaleLowerCase().includes(string.toLocaleLowerCase())) return true;

    // check if a group as the filter string as label
    const groupOptions = options.filter(group =>
      group.label.toLocaleLowerCase().includes(string)
    );

    if (groupOptions) {
      for (const groupOption of groupOptions) {
        // Check if current option is in group
        const option = groupOption.options.find(opt => opt.value === value);
        if (option) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div
      id="search"
    >
      <Select
        options={options}
        placeholder="Search for city"
        onChange={(selected) => { selectCity(selected.value) }}
        filterOption={filterOption}
        styles={{
          container: (provided) => ({
            ...provided,
            width: '300px',
            display: 'inline-block',
            marginRight: '10px',
          }),
          menuList: (provided) => ({
            ...provided,
            textAlign: 'left',
            overflowY: 'scroll',
          }),
        }}
      />
    </div>
  );
}

export default Search;

Search.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectCity: PropTypes.func.isRequired,
};
