/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { FormControlLabel, Checkbox, CardContent } from '@mui/material';

import { colors } from '../Styles/Themes'; 
import { bodyMixin } from '../Styles/Typography';

interface FilterProps {
  options: string[];
  onChange: (selectedOptions: string[]) => void;
}

const StyledFormControlLabel = styled(FormControlLabel)`
  display: block;

  .MuiFormControlLabel-label {
    ${bodyMixin}
  }
`;

const CustomCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: ${colors.secondary};
  }
`;

const Filter: React.FC<FilterProps> = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(options);
  const [selectAll, setSelectAll] = useState(true);

  const handleCheckboxChange = (option: string) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);

    if (updatedOptions.length === options.length) {
      setSelectAll(true);
    } else if (selectAll) {
      setSelectAll(false);
    }
  };

  const handleSelectAllChange = () => {
    const updatedOptions = selectAll ? [] : options;
    
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);
    setSelectAll((prev) => !prev);
  };

  return (
    <CardContent style={{ maxHeight: '45vh', overflow: 'auto' }}>
      <StyledFormControlLabel
        key="all"
        control={
          <CustomCheckbox
            checked={selectAll}
            onChange={handleSelectAllChange}
            name="all"
          />
        }
        label="Wybierz wszystkie"
      />
      {options.map((option) => (
        <StyledFormControlLabel
          key={option}
          control={
            <CustomCheckbox
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              name={option}
            />
          }
          label={option}
        />
      ))}
    </CardContent>
  );
};

export default Filter;
