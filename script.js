const apiKey = "950c39adce058b4c24faa2694ea7e5c8";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;
const searchbox = document.querySelector(".searchbox input");
const searchbtn = document.querySelector(".searchbox button");
const weathericon = document.querySelector(".weather-icon");

async function checkweather(cities) {
    const response = await fetch(apiUrl + cities + `&appid=${apiKey}`);
    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".city").style.display = "none";
    } else {
        const data = await response.json();
        console.log(data);

        // Display weather data
        document.querySelector(".cities").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";
        document.querySelector(".feelslike").innerHTML = data.main.feels_like + "°C";
        document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
        document.querySelector(".description").innerHTML = data.weather[0].description;

        // Convert Unix timestamp to UTC time for sunrise and sunset
        const sunriseTime = new Date(data.sys.sunrise * 1000);
        const sunsetTime = new Date(data.sys.sunset * 1000);

        const formatTime = (date) => {
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes();
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes} UTC`;
        };

        document.querySelector(".sunrise").innerHTML = formatTime(sunriseTime);
        document.querySelector(".sunset").innerHTML = formatTime(sunsetTime);

        // Get and display current date, time, and day
        const currentDate = new Date();

        const formatDate = (date) => {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const day = days[date.getDay()];

            const month = date.toLocaleString('default', { month: 'long' });
            const dayOfMonth = date.getDate();
            const year = date.getFullYear();

            return `${day}, ${month} ${dayOfMonth}, ${year}`;
        };

        const formatCurrentTime = (date) => {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;

            return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${ampm}`;
        };

        document.querySelector(".current-date").innerHTML = formatDate(currentDate);
        document.querySelector(".current-time").innerHTML = formatCurrentTime(currentDate);

        // Update weather icon based on weather condition
        if (data.weather[0].main == "Clouds") {
            weathericon.src = "asset/cloud.png";
        } else if (data.weather[0].main == "Clear") {
            weathericon.src = "asset/clearsky.png";
        } else if (data.weather[0].main == "Rain") {
            weathericon.src = "asset/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weathericon.src = "asset/drizzle-weather-7096832-5753008.webp.png";
        } else if (data.weather[0].main == "Fog") {
            weathericon.src = "asset/fog.png";
        } else if (data.weather[0].main == "Storm") {
            weathericon.src = "asset/storm.png";
        } else if (data.weather[0].main == "Haze") {
            weathericon.src = "asset/haze.png";
        } else if (data.weather[0].main == "Thunderstorm") {
            weathericon.src = "asset/thunderstorm.jpeg";
        }
    }
}

searchbtn.addEventListener("click", () => {
    checkweather(searchbox.value);
});
