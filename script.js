let plan = []

document.addEventListener("DOMContentLoaded", function() {
    async function loadWeatherData() {
        try {
            const weatherData = await getDataFromCSV();
            window.weatherData = weatherData.slice(0, 20);
            showTable(window.weatherData);
        } catch (error) {
            console.error('Greška pri učitavanju podataka:', error);
        }
    }

    loadWeatherData();

    document.querySelector('#primijeni-filtere').addEventListener('click', showFilteredTable);
});

async function getDataFromCSV() {
    const res = await fetch('weather.csv');
    const csv = await res.text();
    const parsedWeatherData = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true
    });

    return parsedWeatherData.data.map(dataRow => ({
        id: dataRow.Id,
        temperature: Number(dataRow.Temperature),
        //humidity: Number(dataRow.Humidity),
        wind_speed: Number(dataRow.WindSpeed),
        //precipitation: Number(dataRow.Precipitation),
        cloud_cover: dataRow.CloudCover,
        atmospheric_pressure: Number(dataRow.AtmosphericPressure),
        //uv_index: Number(dataRow.UVIndex),
        season: dataRow.Season,
        //visibility: Number(dataRow.Visibility),
        location: dataRow.Location,
        weather_type: dataRow.WeatherType
    }));
}

function showTable(weatherData) {
    const tbody = document.querySelector('#vremenska-tablica');
    tbody.innerHTML = ''; 

    for (const data of weatherData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.id}</td>
            <td>${data.temperature} °C</td>
            <td>${data.wind_speed} km/h</td>
            <td>${data.cloud_cover}</td>
            <td>${data.atmospheric_pressure} hPa</td>
            <td>${data.season}</td>
            <td>${data.location}</td>
            <td>${data.weather_type}</td>
            <td><button onClick="toggleAddToPlan('${data.id}', this)">Add</button></td>
        `;
        tbody.appendChild(row);
    }
}

function showFilteredTable() {
    const minTemp = parseFloat(document.querySelector('#filter-temp-min').value) || -Infinity;
    const maxTemp = parseFloat(document.querySelector('#filter-temp-max').value) || Infinity;
    const selectedSeason = document.querySelector('#filter-season').value;
    const selectedWeather = document.querySelector('#filter-weather').value;

    const filteredData = window.weatherData.filter(data => {
        const seasonMatches = selectedSeason ? data.season === selectedSeason : true;
        const weatherMatches = selectedWeather ? data.weather_type === selectedWeather : true;
        const tempMatches = data.temperature >= minTemp && data.temperature <= maxTemp;

        return seasonMatches && weatherMatches && tempMatches;
    });

    showTable(filteredData.slice(0, 20));
}

function toggleAddToPlan(dataID, button) {
    const isInPlan = plan.includes(dataID);

    if (!isInPlan) {
        plan.push(dataID); 
    } else {
        const index = plan.indexOf(dataID);
        plan.splice(index, 1);  
    }

    button.innerText = plan.includes(dataID) ? "Remove" : "Add";
}