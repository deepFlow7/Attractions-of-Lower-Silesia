/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { FormControlLabel, Checkbox, Card, CardContent } from '@mui/material';
import { colors } from '../Styles/Themes'; // Upewnij się, że ścieżka jest poprawna

interface FilterProps {
  options: string[];
  onChange: (selectedOptions: string[]) => void;
}

const StyledFormControlLabel = styled(FormControlLabel)`
  display: block;
`;

const CustomCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: ${colors.dark};
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
    if (updatedOptions.length === options.length) setSelectAll(true);
    else if (selectAll) setSelectAll(false);
  };

  const handleSelectAllChange = () => {
    const updatedOptions = selectAll ? [] : options;
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);
    setSelectAll(prev => !prev);
  };

  return (
    <>
      <CardContent style={{ maxHeight: '45vh', overflow: 'auto' }}>
        <StyledFormControlLabel
          key={'all'}
          control={
            <CustomCheckbox
              checked={selectAll}
              onChange={handleSelectAllChange}
              name={'all'}
            />
          }
          label={'Wybierz wszystkie'}
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
    </>
  );
};

export default Filter;
