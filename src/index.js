import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic

function getWeather(city) {
  let request = new XMLHttpRequest();
  let url;
  if(isNaN(parseInt(city))) {
    url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?zip=${city}&appid=${process.env.API_KEY}`; 
  }
  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElements(response, city);
    } else {
      printError(this, response, city);
      return new Error("API call not successfull");
    }
  });

  request.open("GET", url, true);
  request.send();
}

// UI Logic
function printError(request, apiResponse, city) {
  document.querySelector('#showResponse').innerText = `There was an error accessing the weather data for ${city}: ${request.status} ${request.statusText}: ${apiResponse.message}`;
}

function printElements(apiResponse, city) {
  document.querySelector('#showResponse').innerText = `The humidity in ${city} is ${apiResponse.main.humidity}%.
  The temperature in Kelvins is ${apiResponse.main.temp} degrees.
  The temperature in Fahrenheit is ${((apiResponse.main.temp - 273.15) * 9/5 + 32).toFixed(2)} degrees.
  The temperature in Celcius is ${(apiResponse.main.temp - 273.15).toFixed(2)} degrees.
  It will be a ${apiResponse.weather[0].description}.`;
}

function handleFormSubmission(event) {
  event.preventDefault();
  const city = document.querySelector('#location').value;
  console.log('input ' + typeof city);
  document.querySelector('#location').value = null;
  // getWeather(city);
  try {
    const apiStatus = getWeather(city);
    console.log('get wather return ' + apiStatus);
    if (apiStatus instanceof Error) {
      console.error(apiStatus.message);
      throw Error('API call not successfull');
    } else {
      console.log('Successfull call');
    }
  } catch(error) {
    console.error(`Alert! ${error.message}`);
  }
}

window.addEventListener("load", function() {
  document.querySelector('form').addEventListener("submit", handleFormSubmission);
});