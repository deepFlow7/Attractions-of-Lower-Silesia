import Navbar from './Navbar';
import Filter from './Filter';
import Map from './Map';
import AttractionsList from './AttractionsList';
import { Attraction } from '../types';

interface IndexProps {
  attractions: Attraction[]; 
  filterOptions: string[]; 
}


function Index({ attractions, filterOptions } : IndexProps) {
  function handleFilterChange() {
    // Tutaj można dodać logikę obsługi zmiany filtru, jeśli jest potrzebna
  }

  return (
    <>
      <Navbar />
      <Map />
      <Filter
        options={filterOptions}
        onChange={handleFilterChange}
      />
      <AttractionsList items={attractions} />
    </>
  );
}

export default Index;
