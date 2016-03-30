var ParseServer = require('parse-server').ParseServer;
var logger = require('./helpers/logger');
var express = require('express');
var config = require('config');

module.exports = {
    getServer: function () {
        return ParseServer;
    },
    getLogger: function () {
        return logger;
    },
    getConfig: function () {
        return config;
    },
    getApp: function () {
        var app = express();
        app.use(require('./middlewares/headers'));
        app.use(require('./middlewares/params'));

        return app;
    }
};
