/** @jsxImportSource @emotion/react */
import React from 'react';
import { Grid } from '@mui/material';
import Filter from './Filter';
import { possibleTypes, possibleSubtypes, possible_type, subtypes } from '../types';
import  { Title } from '../Styles/Typography';
interface FilterListProps {
  onChange: (selectedTypes: possible_type[], selectedSubtypes: subtypes[]) => void;
}

const FilterList: React.FC<FilterListProps> = ({ onChange }) => {
  const [selectedTypes, setSelectedTypes] = React.useState<possible_type[]>(possibleTypes);
  const [selectedSubtypes, setSelectedSubtypes] = React.useState<subtypes[]>(possibleSubtypes);

  const handleCheckboxChange = (selected: string[], isType: boolean) => {
    if (isType) {
      const updatedTypes = selected as possible_type[];
      setSelectedTypes(updatedTypes);
      onChange(updatedTypes, selectedSubtypes);
    } else {
      const updatedSubtypes = selected as subtypes[];
      setSelectedSubtypes(updatedSubtypes);
      onChange(selectedTypes, updatedSubtypes);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Title>
          Typy
        </Title>
        <Filter
          options={possibleTypes}
          onChange={(selectedOptions) => handleCheckboxChange(selectedOptions, true)}
        />
      </Grid>
      <Grid item xs={12}>
        <Title>
          Podtypy
        </Title>
        <Filter
          options={possibleSubtypes}
          onChange={(selectedOptions) => handleCheckboxChange(selectedOptions, false)}
        />
      </Grid>
    </Grid>
  );
};

export default FilterList;
