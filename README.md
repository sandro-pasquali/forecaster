# Forecast

Five days of weather and some advice

## Installation

```
npm i
```

## Running and Deploying

The recommendation is to install the [PM2 process manager](https://github.com/Unitech/pm2) and use that to start the server in either `development` or `production` mode:

```
npm start // This runs pm2 in dev mode

or

npm run prod
```

Consult `package.json#scripts` to learn more about how `PM2` is started.
Consult `pm2_dev.json` and/or `pm2_prod.json` to read the relevant `PM2` configuration.

Alternatively you can enter the process directly with:

```
node app.js [9090] // Optional last argument to set server port
```

If run in this way the server is not persistent, and terminates on any interrupt code, such as termination of shell session.

In production(`npm run prod`) `PM2` will spread your server across all available cores.

In development(`npm start`) `PM2` will keep your server alive on a single core. In this mode [`browser-sync`](https://browsersync.io/) will also be enabled, which will give you a nice "hot reload" development flow.

In development `PM2` will also watch for changes in the main `app.js` process file, and restart the server.

Read the docs, but there are a few `PM2` commands that are regularly useful:

`pm2 logs` : Streaming logs. The right way to watch for process outputs/errors and so forth.
`pm2 list` : Shows you a list of all processes `PM2` is managing.
`pm2 info <pid>` : All you need to know about process `<pid>`.
`pm2 delete all` : Kills all processes.
`pm2 delete <pid>` : Kills process `<pid>`.

## Developing with Browser-sync

In dev mode [browser-sync](https://browsersync.io/) is active. `browser-sync` synchronizes server files (in this case all files in the `/public` folder) with the files used to render a view in a browser. 

Whenever you make a change to a file in `/public`, `browser-sync` will typically reload your browser so that you see the changes immediately.

This behavior is not present when run in production via `npm run prod`.

## Demo

- You can see the forecasting demo [here](http://69.41.161.46). This is a personal dedicated server that I manage.
- This was built and tested in Chrome on a Mac. No other browsers were tested, but it's expected that they will also work.

- I'm bored with weather apps. They're all the same. So I wanted to create something fun.
- The goal was to create an interface that "tells the story" of the weather for a day.
- The novelty would be in animations, and further animations of ASCII art (via a 3rd party library).
- This app uses this [weather api](http://openweathermap.org/forecast5)

- A user can type in their city and receive a 5 day forecast in the form of a by-hour animated weather story for today and the next four days.

## Structure

- The server component is an `express` server with a single route handling fetching of weather data.
- The main server file is `app.js`.
- Static file serving is accomplished via the `ecstatic` middleware for `express`, targeting the `/public` folder.
- The cache is implemented as an in-process cache using `node-persist`, optionally memory-only, with a simple `get/set` interface that could easily be ported to another caching system.
- The client uses `jquery` to handle browser events and to communicate with the server.

## Notes

- No tests are implemented. Would want to test the weather endpoint, and that the caching system is working. As well, cross browser testing would be useful.
- The ASCII animations are not as successful as hoped. With more time better graphics with normalized sizes would be implemented, whch would lose the jankiness and improve the feel. Time consuming to find and convert and size ascii art so skipped for time, but could def. be done.
- No checks are in place to notify of unavailable cities.
- This sort of component would do well encapsulated (React, etc). No desire to increase dev time implementing build compilers, etc, but the main search controller would prob. be bound to state update events.
- No gzipping or other effort has been made to reduce load times. 
- The general UI is very rough, but usable.
- The API keys are hardcoded. ENV vars or similar have not been implemented. No real security survey has been made.
- In the end I think the weather-story idea is not going to work -- I think it would at least need truly compelling animations/story. But I enjoyed the exploration.
