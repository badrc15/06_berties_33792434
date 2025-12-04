const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/weather', (req, res) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const city = req.query.city || '';

    if (!city) {
        return res.render('weather', { weather: null, query: '', error: null });
    }

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            return res.render('weather', { weather: null, query: city, error: "Error contacting weather service." });
        }

        let weather;
        try {
            weather = JSON.parse(body);
        } catch {
            return res.render('weather', { weather: null, query: city, error: "Weather service returned invalid data." });
        }

        if (!weather.main) {
            return res.render('weather', { weather: null, query: city, error: `City not found: ${city}` });
        }

        const weatherData = {
            city: weather.name,
            temp: weather.main.temp,
            description: weather.weather[0].description,
            humidity: weather.main.humidity,
            windSpeed: weather.wind.speed,
            feelsLike: weather.main.feels_like,
        };

        res.render('weather', { weather: weatherData, query: city, error: null });
    });
});

module.exports = router;
