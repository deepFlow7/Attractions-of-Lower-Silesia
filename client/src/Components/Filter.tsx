/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Typography, FormControlLabel, Checkbox, Card, CardContent } from '@mui/material';

interface FilterProps {
  options: string[];
  onChange: (selectedOptions: string[]) => void;
}

const StyledCard = styled(Card)`
  padding: 16px;
`;

const Title = styled(Typography)`
  text-align: center;
  font-weight: bold;
  margin-bottom: 16px;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  display: block;
`;

const Filter: React.FC<FilterProps> = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (option: string) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <StyledCard>
      <CardContent>
        {options.map((option) => (
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
