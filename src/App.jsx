import { useState } from 'react';
import './App.css';
import WorldMap from './components/WorldMap';

function App() {
  const [selectedCountry, setSelectedCountry] = useState("");

  return (
    <div className="p-6">
      <WorldMap onCountryClick={setSelectedCountry} />
      {selectedCountry && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold">{selectedCountry}</h2>
          <p>Display culture info for this country here!</p>
        </div>
      )}
    </div>
  );
}

export default App;
