const apiKey = "1f28cc4536b8b32977451691436d12a2";

const lat = -23.9631;
const lon = -46.3919;

const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

const iconEl = document.getElementById("weather-icon");
const tempEl = document.getElementById("current-temp");
const descEl = document.getElementById("weather-desc");
const highEl = document.getElementById("high-temp");
const lowEl = document.getElementById("low-temp");
const humidityEl = document.getElementById("humidity");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const forecastEl = document.getElementById("forecast");

function formatTime(unix) {
    const date = new Date(unix * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function capitalize(text) {
    return text.replace(/\b\w/g, c => c.toUpperCase());
}

// CURRENT WEATHER
async function getCurrentWeather() {
    try {
        const res = await fetch(currentURL);
        const data = await res.json();

        const temp = data.main.temp.toFixed(1);
        const desc = capitalize(data.weather[0].description);
        const high = data.main.temp_max.toFixed(1);
        const low = data.main.temp_min.toFixed(1);
        const humidity = data.main.humidity;

        const sunrise = formatTime(data.sys.sunrise);
        const sunset = formatTime(data.sys.sunset);

        const icon = data.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        iconEl.src = iconURL;

        tempEl.textContent = `${temp}°C`;
        descEl.textContent = desc;
        highEl.textContent = `High: ${high}°C`;
        lowEl.textContent = `Low: ${low}°C`;
        humidityEl.textContent = `Humidity: ${humidity}%`;
        sunriseEl.textContent = `Sunrise: ${sunrise}`;
        sunsetEl.textContent = `Sunset: ${sunset}`;

    } catch (err) {
        console.error("Current weather error:", err);
    }
}

// FORECAST (3 DAYS)
async function getForecast() {
    try {
        const res = await fetch(forecastURL);
        const data = await res.json();

        forecastEl.innerHTML = "";

        const days = data.list.filter((item, index) => index % 8 === 0).slice(0, 3);

        days.forEach((day, index) => {
            const date = new Date(day.dt_txt);
            const temp = day.main.temp.toFixed(1);

            let label;
            if (index === 0) label = "Today";
            else label = date.toLocaleDateString(undefined, { weekday: "long" });

            const div = document.createElement("div");
            div.innerHTML = `<p>${label}: <strong>${temp}°C</strong></p>`;

            forecastEl.appendChild(div);
        });

    } catch (err) {
        console.error("Forecast error:", err);
    }
}

getCurrentWeather();
getForecast();