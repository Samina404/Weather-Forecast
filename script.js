const apiKey = "950c39adce058b4c24faa2694ea7e5c8";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric`;

const searchbox = document.querySelector(".searchbox input");
const searchbtn = document.querySelector(".searchbox button");
const weathericon = document.querySelector(".weather-icon");
const container = document.querySelector('.container');

async function checkweather(cities = null, lat = null, lon = null) {
    let url = "";

    if (cities) {
        url = `${apiUrl}&q=${cities}&appid=${apiKey}`;
    } else if (lat && lon) {
        url = `${apiUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`;
    }

    const response = await fetch(url);

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
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
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

        const updateClock = () => {
            const now = new Date();
            document.querySelector(".current-time").innerHTML = formatCurrentTime(now);
        };

        document.querySelector(".current-date").innerHTML = formatDate(currentDate);
        updateClock();

        setInterval(updateClock, 1000);

        // Update weather icon and background based on weather condition
        if (data.weather[0].main === "Clouds") {
            weathericon.src = "asset/cloud.png";
            container.style.backgroundImage = "url('./cloud.jpg')";
        } else if (data.weather[0].main === "Clear") {
            weathericon.src = "asset/clearsky.png";
            container.style.backgroundImage = "url('./clear.jpg')";
        } else if (data.weather[0].main === "Rain") {
            weathericon.src = "asset/rain.png";
            container.style.backgroundImage = "url('./rain.jpg')";
        } else if (data.weather[0].main === "Drizzle") {
            weathericon.src = "asset/drizzle.png";
            container.style.backgroundImage = "url('./drizzle.jpg')";
        } else if (data.weather[0].main === "Fog") {
            weathericon.src = "asset/fog.png";
            container.style.backgroundImage = "url('./fog.jpg')";
        } else if (data.weather[0].main === "Storm") {
            weathericon.src = "asset/storm.png";
            container.style.backgroundImage = "url('./storm.jpg')";
        } else if (data.weather[0].main === "Haze") {
            weathericon.src = "asset/haze.png";
            container.style.backgroundImage = "url('./haze.jpg')";
        } else if (data.weather[0].main === "Thunderstorm") {
            weathericon.src = "asset/thunderstorm.png";
            container.style.backgroundImage = "url('./thunderstorm.jpg')";
        }
    }
}

// Event listener for search button click
searchbtn.addEventListener("click", () => {
    checkweather(searchbox.value);
});

// Event listener for pressing Enter key in searchbox
searchbox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        searchbtn.click();
    }
});

// Function to get user's current location and display weather
function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            checkweather(null, lat, lon);
        }, (error) => {
            console.error("Error getting location:", error);
            alert("Unable to retrieve your location. Please try again.");
        }, {
            enableHighAccuracy: false, 
            timeout: 10000, 
            maximumAge: 0 
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Call the function to get current location and weather when the page loads
window.addEventListener("load", getLocationAndWeather);
