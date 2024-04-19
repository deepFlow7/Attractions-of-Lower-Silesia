import axios from 'axios';
import './App.css';
import Map from './Maps.jsx';


//data will be the string we send from our server
const apiCall = () => {
  axios.get('http://localhost:8080').then((data) => {
    console.log(data);
    
  })
}

export default function App() {
  const x = 51.1079;
  const y = 17.0385;

  return (
    <div className="App">
      <header className="App-header">

        <button onClick={apiCall}>Make API Call</button>
        <Map x={x} y={y} />
      </header>
    </div>
  );
}
