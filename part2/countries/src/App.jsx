import { useState, useEffect } from "react";
import axios from "axios";
const api = import.meta.env.VITE_OPEN_WEATHER_MAP_KEY;

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const languages = Object.values(country.languages);
  const flag = country.flags.png;

  useEffect(() => {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${country.capital[0]}&limit=5&appid=${api}`,
      )
      .then((response) => {
        const lat = response.data[0].lat;
        const lon = response.data[0].lon;

        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api}`,
          )
          .then((response) => setWeather(response.data));
      });
  }, []);
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
      {weather !== null ? (
        <div>
          <h2>Weather in {country.capital[0]}</h2>{" "}
          <div>temperature {weather.main.temp} celsius</div>{" "}
          <div>wind {weather.wind.speed} m/s</div>
        </div>
      ) : null}
    </div>
  );
};

const CountryItem = ({ country }) => {
  const [show, setShow] = useState(false);
  return (
    <li>
      {country.name.common} <button onClick={() => setShow(true)}>show</button>
      {show ? <CountryInfo country={country} /> : null}
    </li>
  );
};

const Countries = ({ filteredCountries }) => {
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    return (
      <>
        <CountryInfo country={country} />
      </>
    );
  } else if (filteredCountries.length >= 10) {
    return <div>too many matches, specify another filter</div>;
  }
  return (
    <div>
      {filteredCountries.map((country) => (
        <CountryItem key={country.name.common} country={country} />
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
