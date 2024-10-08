/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import { Input as MUIInput } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';
import { ContrastProps, useColors } from '../Providers/Colors';
import { FilterContainer } from '../Styles/Filter';
import { ListContainer } from '../Styles/List';
import { MapContainer } from '../Styles/Map';
import { bodyMixin } from '../Styles/Typography';
import { ViewContainer } from '../Styles/View';
import { Attraction, PossibleType, Preferences, Subtypes } from '../types';
import AttractionsList from './AttractionsList';
import FilterList from './FilterList';
import Map from './Map';

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
`;

const StyledInput = styled(MUIInput) <ContrastProps>`
  & .MuiInputBase-input::placeholder {
    ${({ colors }) => bodyMixin(colors)} 

  }
`;

const Home: React.FC = () => {
  const initialLat = 51.1079;
  const initialLng = 17.0385;
  const [attractions, setAttractions] = useState<Attraction[] | null>(null);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [search, setSearch] = useState<string>("");
  const [favouriteAttractions, setFavouriteAttractions] = useState<number[]>([]);
  const [wantsToVisitAttractions, setWantsToVisitAttractions] = useState<number[]>([]);
  const { isAuthenticated, role } = useAuth();
  const { colors } = useColors();

  useEffect(() => {
    api.get('/api/attractions')
      .then(response => {
        setAttractions(response.data);
        setFilteredAttractions(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });

    if (isAuthenticated && role == "user") {
      api.get('/api/attractions/favourites')
        .then(response => {
          setFavouriteAttractions(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching favourite attractions:', error);
        });

      api.get('/api/attractions/toVisit')
        .then(response => {
          setWantsToVisitAttractions(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching wants to visit attractions:', error);
        });
    }
  }, []);

  if (!attractions) {
    return <div>Loading...</div>;
  }

  const handleFilterChange = (selectedTypes: PossibleType[], selectedSubtypes: Subtypes[], selectedPreferences?: Preferences) => {
    if (attractions) {
      setFilteredAttractions(attractions.filter(attraction => {
        if (!selectedSubtypes.includes(attraction.subtype) || !selectedTypes.includes(attraction.type)) {
          return false;
        }

        if (!isAuthenticated || selectedPreferences == 'wszystkie') {
          return true;
        }

        if (selectedPreferences == 'ulubione') {
          return favouriteAttractions.includes(attraction.id);
        }

        if (selectedPreferences === 'do odwiedzenia') {
          return wantsToVisitAttractions.includes(attraction.id);
        }

        return true;
      }));
    }
  };

  const filterBySearch = (attractions: Attraction[], searchTerm: string) => {
    return attractions.filter(attraction =>
      attraction.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <ViewContainer colors={colors}>
      <MapContainer>
        <Map
          x={initialLat}
          y={initialLng}
          attractions={filterBySearch(filteredAttractions, search)}
        />
      </MapContainer>
      <FilterContainer>
        <FilterList onChange={handleFilterChange} showPreferences={isAuthenticated && role == 'user'} />
      </FilterContainer>
      <ListContainer>
        <InputContainer>
          <StyledInput colors={colors}
            placeholder="Wyszukaj..."
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearchChange}
            startAdornment={
              <IconButton sx={{ p: 0 }} disabled aria-label="search">
                <SearchIcon />
              </IconButton>
            }
          />
        </InputContainer>
        <AttractionsList attractions={filterBySearch(filteredAttractions, search)} />
      </ListContainer>
    </ViewContainer>
  );
};

export default Home;
