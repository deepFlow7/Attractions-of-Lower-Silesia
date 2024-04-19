import Navbar from './Components/Navbar'
import Filter from './Components/Filter'
import Map from './Components/Map'
import './App.css'

function handleFilterChange() {}

function App() {
  return (
    <>
    <Navbar></Navbar>
    <Map />
      <Filter
        options={['Opcja 1', 'Opcja 2', 'Opcja 3']}
        onChange={handleFilterChange}
      />
    </>
  )
}

export default App
