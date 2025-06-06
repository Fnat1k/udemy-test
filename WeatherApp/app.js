require('dotenv').config();
const express = require('express');
const axios = require('axios');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const apiKey = process.env.API_KEY;
const lang = 'ua';
const units = 'metric';

// Головна сторінка
app.get('/', (req, res) => {
  res.redirect('/weather');
});

// Сторінка з кнопками міст
app.get('/weather', (req, res) => {
  const cities = ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Oleksandriya'];
  res.render('weather', { cities });
});

// Сторінка з погодою для конкретного міста
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}&lang=${lang}`;

  try {
    const response = await axios.get(url);
    const weather = response.data;

    res.render('city', {
      city: weather.name,
      temp: weather.main.temp,
      humidity: weather.main.humidity,
      pressure: weather.main.pressure,
      description: weather.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    });
  } catch (error) {
    console.error('Weather fetch error:', error.message);
    res.render('city', {
      error: 'Не вдалося отримати погоду. Спробуйте ще раз.',
      city: city
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});