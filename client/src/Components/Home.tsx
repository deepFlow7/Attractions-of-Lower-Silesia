import React from 'react'
import Filter from './Filter.tsx'
import Map from './Map/Map.tsx'
import AtractionsList from './AttractionsList.tsx'

function handleFilterChange() {}


  const x = 51.1079;
  const y = 17.0385;



function Home() {
  return (
    <>
    <Map x={x} y={y} />
      <Filter
        options={['Opcja 1', 'Opcja 2', 'Opcja 3']}
        onChange={handleFilterChange}
      />
        <AtractionsList items={[]} /> 
    
    </>
  )
}

export default Home
