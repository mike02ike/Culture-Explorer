import { useEffect, useState } from 'react';
import './App.css';
import WorldMap from './components/WorldMap';

// Main application component
function App() {
  // State to hold the selected country
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryData, setCountryData] = useState(null);
  
  // fetch from REST Countries API when selectedCountry changes
  useEffect(() => {
    if (!selectedCountry) return;

    fetch(`https://restcountries.com/v3.1/name/${selectedCountry.sovereignt}?fullText=true`)
      .then((res) => res.json())
      .then((data) => setCountryData(data[0]))
      .catch((err) => console.error("Error fetching country data:", err));
  }, [selectedCountry]);

  return (
    <div className="p-6">
      <WorldMap onCountryClick={setSelectedCountry} />

      {selectedCountry && (
        <div className="info-panel">
          <div className="country-header">
            <h2 className="text-xl font-semibold">{selectedCountry.name}</h2>
            {countryData?.flags?.png && (
              <img
                src={countryData.flags.png}
                alt={`${selectedCountry.name} flag`}
                className="country-flag"
              />
            )}
          </div>

          {/* From API */}
          {countryData && (
            <>
              <p>Official Name: {countryData.name.official}</p>
              <p>Population: {countryData.population.toLocaleString()}</p>
              <p>Region: {countryData.region} — {countryData.subregion}</p>
              <p>
                Official Language{Object.keys(countryData.languages).length > 1 ? "s" : ""}:{" "}
                {Object.values(countryData.languages)
                  .join(", ")}
              </p>
              <p>
                Currenc{Object.keys(countryData.currencies).length > 1 ? "ies" : "y"}:{" "}
                {Object.values(countryData.currencies)
                  .map(curr => `${curr.name} (${curr.symbol})`)
                  .join(", ")}
              </p>
              <p>
                Capital{Array.isArray(countryData.capital) && countryData.capital.length > 1 ? "s" : ""}:{" "}
                {Array.isArray(countryData.capital)
                  ? countryData.capital.join(", ")
                  : countryData.capital}
              </p>
              <p>Area: {Math.round((countryData.area * 0.386102), 0).toLocaleString()} mi²</p>
            
            </>
          )}

          {/* From your JSON */}
          {/* <p>Music: {selectedCountry.music}</p>
          <p>Foods: {selectedCountry.foods.join(", ")}</p>
          <p>Traditions: {selectedCountry.traditions.join(", ")}</p> */}

          <p>
            <a
              href={`https://www.cia.gov/the-world-factbook/countries/${selectedCountry.name_long}/#introduction`.toLowerCase().replace(/ /g, "-")}
              target="_blank"
              className="text-blue-600 underline"
            >
              Learn more about {`${selectedCountry.name_long}`}!
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

function formatGDP(gdpMillions) {
  if (gdpMillions >= 1_000_000) {
    // Convert millions → trillions
    return `$${(gdpMillions / 1_000_000).toFixed(1)} trillion`;
  } else if (gdpMillions >= 1_000) {
    // Convert millions → billions
    return `$${(gdpMillions / 1_000).toFixed(1)} billion`;
  } else {
    // Keep in millions
    return `$${gdpMillions.toLocaleString()} million`;
  }
}

export default App;
