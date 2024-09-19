/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { FormControlLabel, Checkbox, CardContent } from '@mui/material';
import { bodyMixin } from '../Styles/Typography';
import { useColors, ContrastProps } from '../Providers/Colors'; 

interface FilterProps {
  options: string[];
  onChange: (selectedOptions: string[]) => void;
}

const StyledFormControlLabel = styled(FormControlLabel)<ContrastProps>`
  display: block;
  .MuiFormControlLabel-label {
    ${({ colors }) => bodyMixin(colors)} 
  }
`;

const CustomCheckbox = styled(Checkbox)<ContrastProps>`
  &.Mui-checked {
    color: ${props => props.colors.secondary}
  }
`;

const Filter: React.FC<FilterProps> = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(options);
  const [selectAll, setSelectAll] = useState(true);
  const { colors } = useColors();

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
    <CardContent >
      <StyledFormControlLabel colors={colors} 
        key="all"
        control={
          <CustomCheckbox
          colors={colors}
            checked={selectAll}
            onChange={handleSelectAllChange}
            name="all"
          />
        }
        label="wszystkie"
      />
      {options.map((option) => (
        <StyledFormControlLabel colors={colors} 
          key={option}
          control={
            <CustomCheckbox
            colors={colors}
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
