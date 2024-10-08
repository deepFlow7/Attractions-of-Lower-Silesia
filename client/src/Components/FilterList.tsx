/** @jsxImportSource @emotion/react */
import {
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useColors } from '../Providers/Colors';
import { Body, Title } from "../Styles/Typography";
import {
  possiblePreferences,
  possibleSubtypes,
  PossibleType,
  possibleTypes,
  Preferences,
  Subtypes,
} from "../types";
import Filter from "./Filter";

interface FilterListProps {
  onChange: (
    selectedTypes: PossibleType[],
    selectedSubtypes: Subtypes[],
    selectedPreferences?: Preferences
  ) => void;
  showPreferences?: boolean;
}

const FilterList: React.FC<FilterListProps> = ({
  onChange,
  showPreferences,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTypes, setSelectedTypes] =
    React.useState<PossibleType[]>(possibleTypes);
  const [selectedSubtypes, setSelectedSubtypes] =
    React.useState<Subtypes[]>(possibleSubtypes);
  const [selectedPreferences, setSelectedPreferences] =
    React.useState<Preferences>("wszystkie");
  const [openSubtypes, setOpenSubtypes] = React.useState<boolean>(
    !isSmallScreen
  );
  const [openTypes, setOpenTypes] = React.useState<boolean>(
    !isSmallScreen
  );
  const [openPreferences, setOpenPreferences] = React.useState<boolean>(
    !isSmallScreen
  );
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
  const { colors } = useColors();

  return (
    <Grid container spacing={3}>
      {showPreferences && (
        <Grid item xs={12}>
          <Button onClick={() => setOpenPreferences(!openPreferences)}>
            <Title colors={colors}>
              Moje{" "}
              {isSmallScreen ? (
                <svg
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="-10 0 30 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
                    fill={colors.secondary as string}
                  />
                </svg>
              ) : (
                <></>
              )}
            </Title>
          </Button>
          <Collapse in={openPreferences || !isSmallScreen}>
            <FormControl fullWidth component="fieldset">
              <RadioGroup
                aria-label="preferences"
                name="preferences"
                value={selectedPreferences}
                onChange={(event) =>
                  handlePreferencesChange(event.target.value as Preferences)
                }
              >
                {possiblePreferences.map((preference) => (
                  <FormControlLabel
                    key={preference}
                    value={preference}
                    control={
                      <Radio
                        sx={{
                          color: colors.secondary as string,
                          "&.Mui-checked": {
                            color: typeof colors.secondary === 'string' ? colors.secondary : '', // Sprawdzenie czy color jest stringiem
                          },
                          "&:hover": {
                            color: typeof colors.tertiary === 'string' ? colors.tertiary : '', // Sprawdzenie czy color jest stringiem
                          },
                        }}
                      />

                    }
                    label={<Body colors={colors}>{preference}</Body>}
                    sx={{
                      marginLeft: 1,
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Collapse>
        </Grid>
      )}
      <Grid item xs={12}>
        <Button onClick={() => setOpenTypes(!openTypes)}>
          <Title colors={colors}>
            Typy{" "}
            {isSmallScreen ? (
              <svg
                width="1.5rem"
                height="1.5rem"
                viewBox="-10 0 30 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
                  fill={colors.secondary as string}
                />
              </svg>
            ) : (
              <></>
            )}
          </Title>
        </Button>
        <Collapse in={openTypes || !isSmallScreen}>
          <Filter
            options={possibleTypes}
            onChange={(selectedOptions) =>
              handleCheckboxChange(selectedOptions, true)
            }
          />
        </Collapse>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={() => setOpenSubtypes(!openSubtypes)}>
          <Title colors={colors}>
            Podtypy
            {isSmallScreen ? (
              <svg
                width="1.5rem"
                height="1.5rem"
                viewBox="-10 0 30 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
                  fill={colors.secondary as string}
                />
              </svg>
            ) : (
              <></>
            )}
          </Title>
        </Button>
        <Collapse in={openSubtypes || !isSmallScreen}>
          <Filter
            options={possibleSubtypes}
            onChange={(selectedOptions) =>
              handleCheckboxChange(selectedOptions, false)
            }
          />
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default FilterList;
