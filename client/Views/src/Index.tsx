import Navbar from './Components/Navbar'
import Filter from './Components/Filter'
import Map from './Components/Map'
import AtractionsList from './Components/AttractionsList'
import './Index.css'

function handleFilterChange() {}

function Index() {
  return (
    <>
    <Navbar></Navbar>
    <Map />
      <Filter
        options={['Opcja 1', 'Opcja 2', 'Opcja 3']}
        onChange={handleFilterChange}
      />
        <AtractionsList items={["atrakcja 1", "atrakcja 2"]} /> 
    
    </>
  )
}

export default Index
