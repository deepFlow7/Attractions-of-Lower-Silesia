import React from 'react'
import Filter from './Filter'
import Map from './Map'
import AttractionsList from './AttractionsList'
import { Attraction } from '../types';

interface HomeProps {
  attractions: Attraction[]; 
  filterOptions: string[]; 
}



  const x = 51.1079;
  const y = 17.0385;



function Home({ attractions, filterOptions} : HomeProps) {
  function handleFilterChange() {
  // Tutaj można dodać logikę obsługi zmiany filtru, jeśli jest potrzebna
  }
  return (
    <>
      <Map x={x} y={y} />
      <Filter
        options={filterOptions}
        onChange={handleFilterChange}
      />
      <AttractionsList items={attractions} />
    
    </>
  )
}

export default Home
