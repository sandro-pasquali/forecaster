'use strict';

let http = require('http');
let path = require('path');
let express = require('express');
let ecstatic = require('ecstatic');
let axios = require('axios');
let cache = require('node-persist');

// pm2 will set env#PORT via `npm run dev`, `npm run prod`. @see pm2_config.json
// Or you can run `node app.js 8020` to run on :8020
//
let port = process.env.PORT || process.argv[2] || '8080';

// Weather API. Ideally key would be in ENV.
//
let key = '0fa44fcfa70d2c45516605a7195354c7';
let weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

let app = express();

// Set #continuous to false to keep caching in-memory.
//
cache.init({
    dir: path.join(__dirname, 'cache'),
    encoding: 'utf8',
    continuous: true
}).catch(err => {

    // Unable to init cache
    //
    throw err;
});

// Vanilla file server for /public files
//
app.use(
    ecstatic({
        root: `${__dirname}/public`,
        handleError: false
    })
);

http.createServer(app).listen(port, () => {
    console.log(`Listening on :${port}`);
    require('./browser_sync.js');
});

// Fetch for cities and cache in cache for 1 hour.
//
app.get('/forecast/:city', (req, res, next) => {

    let query = req.params.city;

    return cache
    .getItem(query)
    .then(it => {

        if(it) {
            return res.status(200).json(it);
        }

        let apiCall = `http://api.openweathermap.org/data/2.5/forecast?q=${query}&APPID=${key}`;

        return axios
        .get(apiCall)
        .then(response => {

            // Reduce down to map of next 5 days containing periodic weather data.
            //
            let seq = response.data.list.reduce((acc, obj) => {

                let date = new Date(obj.dt*1000);
                let dayOfWeek = weekdays[date.getDay()];

                acc[dayOfWeek] = acc[dayOfWeek] || [];

                acc[dayOfWeek].push({
                    hr: date.getHours(),
                    desc: obj.weather[0].description
                });

                return acc;

            }, {});

            // Get fresh weather data once per hour (ie. expire in 1 hr).
            //
            cache.setItem(query, seq, {
                ttl: 1000*60*60 // 1 hr
            });

            res.status(200).json(seq);
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    });
});


