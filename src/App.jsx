// import React hooks and styles
import { useEffect, useState } from 'react';
import './App.css';
import WorldMap from './components/WorldMap';

// Main application
function App() {
  const [selectedCountry, setSelectedCountry] = useState(""); // currently selected country
  const [countryData, setCountryData] = useState(null);       // country data from API

  // fetch country data when selectedCountry changes
  useEffect(() => {
    if (!selectedCountry) return;

    fetch(`https://restcountries.com/v3.1/name/${selectedCountry.admin}?fullText=true`)
      .then((res) => res.json())
      .then((data) => setCountryData(data[0])) // store first result
      .catch((err) => console.error("Error fetching country data:", err));
  }, [selectedCountry]);

  return (
    <div className="p-6">
      {/* interactive world map */}
      <WorldMap
        onCountryClick={setSelectedCountry}
        selectedCountry={selectedCountry} 
        countryData={countryData}
      />

      {selectedCountry && (
        <div className="info-panel">
          {/* country header with flag */}
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

          {/* country info from API */}
          {countryData && (
            <>
              <p>Official Name: {countryData.name.official}</p>
              <p>Population: {countryData.population.toLocaleString()}</p>
              <p>Region: {countryData.region} — {countryData.subregion}</p>
              <p>
                Official Language{Object.keys(countryData.languages).length > 1 ? "s" : ""}:{" "}
                {Object.values(countryData.languages).join(", ")}
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
              <p>Independent? {countryData.independent ? "Yes" : "No"}</p>
              <p>Number of Timezones: {countryData.timezones.length}</p>

              {/* capitalize driving side safely */}
              <p>
                Drives on: {countryData.car?.side
                  ? countryData.car.side.charAt(0).toUpperCase() + countryData.car.side.slice(1)
                  : "Unknown"}
              </p>
            </>
          )}

          {/* optional content from JSON */}
          {/* <p>Music: {selectedCountry.music}</p>
          <p>Foods: {selectedCountry.foods.join(", ")}</p>
          <p>Traditions: {selectedCountry.traditions.join(", ")}</p> */}

          {/* external links */}
          <p>
            <a
              href={`https://www.cia.gov/the-world-factbook/countries/${selectedCountry.name_long}/#introduction`.toLowerCase().replace(/ /g, "-")}
              target="_blank"
              className="text-blue-600 underline"
            >
              Learn more about {selectedCountry.name_long}!
            </a>
          </p>
          <p>
            <a
              href={countryData?.maps?.googleMaps}
              target="_blank"
              className="text-blue-600 underline"
            >
              View on Google Maps
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

// helper to format GDP values
function formatGDP(gdpMillions) {
  if (gdpMillions >= 1_000_000) return `$${(gdpMillions / 1_000_000).toFixed(1)} trillion`;
  if (gdpMillions >= 1_000) return `$${(gdpMillions / 1_000).toFixed(1)} billion`;
  return `$${gdpMillions.toLocaleString()} million`;
}

export default App;
