/** @jsxImportSource @emotion/react */
import React from 'react';
import { Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

import Filter from './Filter';
import { possibleTypes, possibleSubtypes, PossibleType, Subtypes, possiblePreferences, Preferences } from '../types';
import { Title } from '../Styles/Typography';

interface FilterListProps {
  onChange: (selectedTypes: PossibleType[], selectedSubtypes: Subtypes[], selectedPreferences?: Preferences) => void;
  showPreferences?: boolean;
}

const FilterList: React.FC<FilterListProps> = ({ onChange, showPreferences }) => {
  const [selectedTypes, setSelectedTypes] = React.useState<PossibleType[]>(possibleTypes);
  const [selectedSubtypes, setSelectedSubtypes] = React.useState<Subtypes[]>(possibleSubtypes);
  const [selectedPreferences, setSelectedPreferences] = React.useState<Preferences>('wszystkie');

  const handleCheckboxChange = (selectedOptions: string[], isType: boolean) => {
    if (isType) {
      const updatedTypes = selectedOptions as PossibleType[];
      setSelectedTypes(updatedTypes);
      onChange(updatedTypes, selectedSubtypes, selectedPreferences);
    } else {
      const updatedSubtypes = selectedOptions as Subtypes[];
      setSelectedSubtypes(updatedSubtypes);
      onChange(selectedTypes, updatedSubtypes, selectedPreferences);
    }
  };

  const handlePreferencesChange = (preferences: Preferences) => {
    setSelectedPreferences(preferences);
    onChange(selectedTypes, selectedSubtypes, preferences);
  };

  return (
    <Grid container spacing={3}>
      {showPreferences && (
        <Grid item xs={12}>
          <Title>Preferencje</Title>
          <FormControl fullWidth>
            <InputLabel id="preference-label">Preferencje</InputLabel>
            <Select
              labelId="preference-label"
              value={selectedPreferences}
              onChange={(event) => handlePreferencesChange(event.target.value as Preferences)}
            >
              {possiblePreferences.map((preference) => (
                <MenuItem key={preference} value={preference}>
                  {preference}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )
      }
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
