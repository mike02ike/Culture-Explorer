// import React hooks and styles
import { useEffect, useRef, useState } from 'react';
import Draggable from "react-draggable";
import './App.css';
import WorldMap from './components/WorldMap';
import worldData from './data/geoVector.json';


// Main application
function App() {
  const [selectedCountry, setSelectedCountry] = useState(""); // currently selected country
  const [countryData, setCountryData] = useState(null);       // country data from API
  // find the country feature in geoVector.json
  const countryFeature = worldData.features.find(
    (feat) => feat.properties.iso_a3 === countryData?.cca3
  );
  const panelRef = useRef();

  // fetch country data when selectedCountry changes
  useEffect(() => {
    if (!selectedCountry) return;

    fetch(`https://restcountries.com/v3.1/name/${selectedCountry.admin}?fullText=true`)
      .then((res) => res.json())
      .then((data) => setCountryData(data[0])) // store first result
      .catch((err) => console.error("Error fetching country data:", err));

    if (selectedCountry) {
      document.title = `${selectedCountry.name} - Culture Explorer`;
    } else {
      document.title = "Culture Explorer";
  }
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
        <Draggable  nodeRef={panelRef} 
                    bounds="parent" 
                    cancel="p, h2, a, span, img"
                    axis='x'>
          <div className="info-panel" ref={panelRef}>
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
                <p>
                  <strong>Official Name:</strong> {countryData.name.official}
                </p>
                <p>
                  <strong>Population:</strong> {countryData.population.toLocaleString()}
                </p>
                <p>
                  <strong>GDP:</strong>{" "}
                  {countryFeature?.properties?.gdp_md
                    ? formatGDP(countryFeature.properties.gdp_md)
                    : "N/A"}
                </p>
                <p>
                  <strong>Economy:</strong>{" "}
                  {countryFeature?.properties?.economy
                  ? countryFeature.properties.economy.slice(2)
                  : "N/A"}
                </p>
                <p>
                  <strong>Region:</strong> {countryData.region} — {countryData.subregion}
                </p>
                <p>
                  <strong>Official Language{Object.keys(countryData.languages).length > 1 ? "s" : ""}:</strong>{" "}
                  {Object.values(countryData.languages).join(", ")}
                </p>
                <p>
                  <strong>Currenc{Object.keys(countryData.currencies).length > 1 ? "ies" : "y"}:</strong>{" "}
                  {Object.values(countryData.currencies)
                    .map(curr => `${curr.name} (${curr.symbol})`)
                    .join(", ")}
                </p>
                <p>
                  <strong>Capital{Array.isArray(countryData.capital) && countryData.capital.length > 1 ? "s" : ""}:</strong>{" "}
                  {Array.isArray(countryData.capital)
                    ? countryData.capital.join(", ")
                    : countryData.capital}
                </p>
                <p>
                  <strong>Area:</strong> {Math.round((countryData.area * 0.386102), 0).toLocaleString()} mi²
                </p>
                <p>
                  <strong>Independent?</strong> {countryData.independent ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Number of Timezones:</strong> {countryData.timezones.length}
                </p>
                <p>
                  <strong>Start of Week:</strong> {countryData.startOfWeek
                    ? countryData.startOfWeek.charAt(0).toUpperCase() + countryData.startOfWeek.slice(1)
                    : "Unknown"}
                </p>
                <p>
                  <strong>Drives on:</strong> {countryData.car?.side
                    ? countryData.car.side.charAt(0).toUpperCase() + countryData.car.side.slice(1)
                    : "Unknown"}
                </p>
              </>
            )}

            {/* external links */}
            <p>
              {/* <a
                href={`https://www.cia.gov/the-world-factbook/countries/${selectedCountry.name_long}/#introduction`.toLowerCase().replace(/ /g, "-")}
                target="_blank"
                className="text-blue-600 underline"
              >
                Learn more about {selectedCountry.name_long}!
              </a> */}
            </p>
            <p>
              <a
                href={countryData?.maps?.googleMaps}
                target="_blank"
                className="text-blue-600 underline"
                rel="noopener noreferrer"
              >
                View on Google Maps
              </a>
            </p>
          </div>
        </Draggable>
      )}
    </div>
  );
}

// helper to format GDP values
function formatGDP(gdpMillions) {
  if (gdpMillions >= 1_000_000) return `$${(gdpMillions / 1_000_000).toFixed(1)} Trillion`;
  if (gdpMillions >= 1_000) return `$${(gdpMillions / 1_000).toFixed(1)} Billion`;
  return `$${gdpMillions.toLocaleString()} Million`;
}

export default App;
