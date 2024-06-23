/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { FormControlLabel, Checkbox, Card, CardContent } from '@mui/material';

interface FilterProps {
  options: string[];
  onChange: (selectedOptions: string[]) => void;
}

const StyledCard = styled(Card)`
  padding: 2px;
`;


const StyledFormControlLabel = styled(FormControlLabel)`
  display: block;
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
    if (updatedOptions.length == options.length)
      setSelectAll(true);
    else if (selectAll)
      setSelectAll(false);
  };

  const handleSelectAllChange = () => {
    const updatedOptions = selectAll? [] : options;
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);
    setSelectAll(prev => !prev);
  };

 
  return (
    <StyledCard>
      <CardContent style={{maxHeight: "45vh", overflow: "auto"}}>
      <StyledFormControlLabel
            key={"all"}
            control={
              <Checkbox
                checked={selectAll}
                onChange={() => handleSelectAllChange()}
                name={"all"}
                color="primary"
              />
            }
            label={"Wybierz wszystkie"}
          />
        {options?.map((option) => (
          <StyledFormControlLabel
            key={option}
            control={
              <Checkbox
                checked={selectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                name={option}
                color="primary"
              />
            }
            label={option}
          />
        ))} 
      </CardContent>
    </StyledCard>
  );
};

export default Filter;
