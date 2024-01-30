import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

const APIkey = "4ed5f33dc8c2232ef32b967bf8990202";

const translations = {
  en: {
    search: "Search",
    loading: "Loading...",
    errorFetchingWeather: "Error fetching weather data",
    cityNotFoundError: "City not found. Please check the city name.",
    language: "Language",
  },
  fr: {
    search: "Rechercher",
    loading: "Chargement...",
    errorFetchingWeather:
      "Erreur lors de la récupération des données météorologiques",
    cityNotFoundError:
      "Aucune donnée trouvée pour la ville. Veuillez vérifier le nom de la ville.",
    language: "Langue",
  },
  es: {
    search: "Buscar",
    loading: "Cargando...",
    errorFetchingWeather: "Error al obtener datos meteorológicos",
    cityNotFoundError:
      "No se encontraron datos para la ciudad. Por favor, verifica el nombre de la ciudad.",
    language: "Idioma",
  },
};

const backgrounds = {
  soleado: "url(https://res.cloudinary.com/dfc7m5ola/image/upload/v1706585544/_7f5808e6-05cb-48d2-b8fd-68ed0bdf2a8b_dblq1s.jpg)",
  ventoso:
    "url(https://res.cloudinary.com/dfc7m5ola/image/upload/v1706585544/_49932833-6311-49e0-a504-e0cd2abcf78a_wf9wso.jpg)",
  caluroso:
    "url(https://res.cloudinary.com/dfc7m5ola/image/upload/v1706585544/_8ab8fc47-594a-48db-aa59-0d9f1aa83591_m4w6cy.jpg)",
  frio: "url(https://res.cloudinary.com/dfc7m5ola/image/upload/v1706585544/_2ccbbe4f-e615-4eaa-9767-c53a7165591b_lxexnt.jpg)",
};

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [finder, setFinder] = useState();
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const success = (position) => {
    const obj = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    setCoords(obj);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  useEffect(() => {
    if (coords) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${APIkey}&lang=${currentLanguage}`;
      axios
        .get(url)
        .then((res) => {
          const obj = {
            celsius: (res.data.main.temp - 273.15).toFixed(2),
            fahrenheit: ((res.data.main.temp - 273.15) * (9 / 5) + 32).toFixed(
              2
            ),
          };
          setTemp(obj);
          setWeather(res.data);
        })
        .catch((err) => {
          setError(translations[currentLanguage].errorFetchingWeather);
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [coords, currentLanguage]);

  useEffect(() => {
    if (textInput) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${APIkey}&lang=${currentLanguage}`;
      axios
        .get(url)
        .then((res) => {
          const obj = {
            celsius: (res.data.main.temp - 273.15).toFixed(2),
            fahrenheit: ((res.data.main.temp - 273.15) * (9 / 5) + 32).toFixed(
              2
            ),
          };
          setTemp(obj);
          setFinder(res.data);
        })
        .catch((err) => {
          setError(translations[currentLanguage].cityNotFoundError);
          console.error(err);
        });
    }
  }, [textInput, currentLanguage]);

  const obtenerFondoSegunClima = () => {
    const condicionesClimaticas = textInput ? finder : weather;

    if (
      !condicionesClimaticas ||
      !condicionesClimaticas.main ||
      !condicionesClimaticas.clouds
    ) {
      return backgrounds.soleado; // Fondo por defecto
    }

    const temperatura = condicionesClimaticas.main.temp;
    const nubes = condicionesClimaticas.clouds.all;
    const velocidadViento = condicionesClimaticas.wind.speed;

    if (temperatura > 25 && nubes < 50) {
      return backgrounds.caluroso; // Fondo caluroso
    } else if (nubes > 70) {
      return backgrounds.nublado; // Fondo nublado
    } else if (temperatura < 10) {
      return backgrounds.frio; // Fondo frío
    } else if (velocidadViento > 5) {
      return backgrounds.ventoso; // Fondo ventoso
    } else {
      return backgrounds.soleado; // Fondo por defecto para otras condiciones
    }
  };

  const changeLanguage = () => {
    const languages = ["en", "fr", "es"];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  return (
    <div className="app" style={{ backgroundImage: obtenerFondoSegunClima() }}>
      <div className="language-menu">
        <button className="language-button" onClick={changeLanguage}>
          {translations[currentLanguage].language}:{" "}
          {currentLanguage.toUpperCase()}
        </button>
      </div>
      {isLoading ? (
        <h2 className="loader">{translations[currentLanguage].loading}</h2>
      ) : (
        <WeatherCard
          weather={textInput ? finder : weather}
          temp={temp}
          setTextInput={setTextInput}
          error={error}
          currentLanguage={currentLanguage}
        />
      )}
    </div>
  );
}

export default App;
