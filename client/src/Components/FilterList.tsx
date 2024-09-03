/** @jsxImportSource @emotion/react */
import React from 'react';
import { Grid } from '@mui/material';

import Filter from './Filter';
import { possibleTypes, possibleSubtypes, PossibleType, Subtypes } from '../types';
import { Title } from '../Styles/Typography';

interface FilterListProps {
  onChange: (selectedTypes: PossibleType[], selectedSubtypes: Subtypes[]) => void;
}

const FilterList: React.FC<FilterListProps> = ({ onChange }) => {
  const [selectedTypes, setSelectedTypes] = React.useState<PossibleType[]>(possibleTypes);
  const [selectedSubtypes, setSelectedSubtypes] = React.useState<Subtypes[]>(possibleSubtypes);

  const handleCheckboxChange = (selectedOptions: string[], isType: boolean) => {
    if (isType) {
      const updatedTypes = selectedOptions as PossibleType[];
      setSelectedTypes(updatedTypes);
      onChange(updatedTypes, selectedSubtypes);
    } else {
      const updatedSubtypes = selectedOptions as Subtypes[];
      setSelectedSubtypes(updatedSubtypes);
      onChange(selectedTypes, updatedSubtypes);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Title>Typy</Title>
        <Filter
          options={possibleTypes}
          onChange={(selectedOptions) => handleCheckboxChange(selectedOptions, true)}
        />
      </Grid>
      <Grid item xs={12}>
        <Title>Podtypy</Title>
        <Filter
          options={possibleSubtypes}
          onChange={(selectedOptions) => handleCheckboxChange(selectedOptions, false)}
        />
      </Grid>
    </Grid>
  );
};

export default FilterList;
