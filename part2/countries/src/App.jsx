import { useState, useEffect } from "react";
import axios from "axios";

const Countries = ({ filteredCountries }) => {
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    const languages = Object.values(country.languages);
    const flag = country.flags.png;
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital[0]}</div>
        <div>area {country.area}</div>
        <h2>Languages</h2>
        <ul>
          {languages.map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <img src={flag} alt="flag of country" />
      </div>
    );
  } else if (filteredCountries.length >= 10) {
    return <div>too many matches, specify another filter</div>;
  }
  return (
    <div>
      {filteredCountries.map((country) => (
        <li key={country.name.common}>{country.name.common}</li>
      ))}
    </div>
  );
};

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => setCountries(response.data));
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter),
  );
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <Countries filteredCountries={filteredCountries} />
    </div>
  );
}

export default App;
