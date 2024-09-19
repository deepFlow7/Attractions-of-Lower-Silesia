/** @jsxImportSource @emotion/react */
import React from 'react';
import { Grid, MenuItem, Select, InputLabel, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { colors } from '../Styles/Themes';
import Filter from './Filter';
import { possibleTypes, possibleSubtypes, PossibleType, Subtypes, possiblePreferences, Preferences } from '../types';
import { Body, Title } from '../Styles/Typography';

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
          <Title>Moje</Title>
          <FormControl fullWidth component="fieldset">
            <RadioGroup
              aria-label="preferences"
              name="preferences"
              value={selectedPreferences}
              onChange={(event) => handlePreferencesChange(event.target.value as Preferences)}
            >
              {possiblePreferences.map((preference) => (
                <FormControlLabel
                  key={preference}
                  value={preference}
                  control={
                    <Radio 
                      sx={{
                        color: colors.secondary,  
                        '&.Mui-checked': {
                          color: colors.secondary, 
                        },
                        '&:hover': {
                          color: colors.tertiary, 
                        },
                      }}
                    />
                  }
                  label={<Body>{preference}</Body>}
                  sx={{
                    marginLeft: 1,  
                  }}
                />
              ))}
            </RadioGroup>
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
