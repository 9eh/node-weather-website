const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');


const app = express();

// define path for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// set up handlebar engine and view location 
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Eh Hser'
    })
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Weather App',
        name: 'Eh Hser'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Eh Hser'
    });
});

app.get('/help/*', (req, res) => {
    res.render('error', {
        message: 'Help article not found.',
        name: 'Eh Hser'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        });
    }

    geocode(req.query.address, (error, {latitude, longtitude, location} = {}) => {
        if (error) {
            return res.send({
                error: error
            });
        }
    
        forecast(latitude, longtitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: error
                });
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            });
        });
    
    });
});


app.get('*', (req, res) => {
    res.render('error', {
        message: 'Page not found.',
        name: 'Eh Hser'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
});