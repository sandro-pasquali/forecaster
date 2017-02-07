'use strict';

let path = require('path');
let bsInstance = require('browser-sync').create('main');

// pm2 will set env#PORT via `npm run dev`, `npm run prod`. @see pm2_config.json
//
let port = process.env.PORT || '8080';

bsInstance.init({
    port: 3000,
    open: true,
    ui: false,
    proxy: {
        target: `http://localhost:${port}`,
        ws: true
    },
    watchOptions: {
        ignoreInitial: true,
        ignored: [
            "app/**/router.js", // router file changes are handled in server/add-routers.js
            "app/**/*.marko.js", // Compliled templates. Only refresh on template (*.marko) changes.
            "app/*/brain/**" // /brain is managed separately. @see add-brains.js
        ]
    },
    files: [{
        match: [
            "public/**/*.js",
            "public/**/*.css",
            "public/**/*.html"
        ],
        fn: function(event, file) {

            console.log("REFRESHING BROWSERS...")

            this.reload();
        }
    }],
    notify: false,
    tunnel: false,
    browser: "google chrome",
    reloadDelay: 10,
    reloadDebounce: 2000,
    ghostMode: {
        clicks: true,
        forms: true,
        scroll: true
    }
});

module.exports = bsInstance;
