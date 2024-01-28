import React, { useRef, useState } from 'react';
import './styles/WeatherCard.css';

const WeatherCard = ({weather, temp, setTextInput}) => {

    const [isCelsius, setIsCelsius] = useState(true);

    

    const handleChange = () => {
        setIsCelsius(!isCelsius);

    }

    const city = useRef();
  

    const handleForm = event => {
        event.preventDefaut();
        setTextInput(city.current.value.toLowerCase().trim());
        
    }

  return (
    <section className='weather'>
        <h1 className='weather__title'>Weather App</h1> 
        <form className='weather__form' onSubmit={handleForm}>
            <input type="text" ref={city} />
            <button>Search</button>
        </form>   
        <h2 className='weather__city'>{weather?.name}, {weather?.sys.country}</h2>
        <article className='weather__container1'>
            <figure className='weather__fig'>
                <img className='weather__img'
                 src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`} alt="weather icon" />
            </figure>
            <div>
                <h3 className='weather__clouds'>{weather?.weather[0].description}</h3>
                <ul className='weather__info'>
                    <li><span>Wind speed: </span><span>{weather?.wind.speed} "m/s"</span></li>
                    <li><span>Clouds: </span><span>{weather?.clouds.all} %</span></li>
                    <li><span>Pressure: </span><span>{weather?.main.pressure } hPa</span></li>
                    <li><span>Humidity: </span><span>{weather?.main.humidity} %</span></li>
                </ul>
            </div>
        </article>
        <div className='weather__conteiner2'>
            <h3 className='weather__temp'>{
                isCelsius  ?
                   temp?.celsius+'°C'
                :
                   temp?.fahrenheit+'°F'
            }</h3>
            <button className='weather__btn' onClick={handleChange}>
                Change to {isCelsius?'°F':'°C'} 
                </button>
        </div>    
    
    </section>
  )
}

export default WeatherCard;