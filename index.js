var ParseServer = require('parse-server').ParseServer;
var logger = require('./helpers/logger');
var express = require('express');
var yaml = require('js-yaml');
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

        // api-json swagger
        app.get('/docs', function(req, res){
            var docs = yaml.safeLoad(fs.readFileSync('./docs/swagger.yml', 'utf8'));
            res.send(JSON.stringify(docs));
        });

        // add-on swagger-ui
        app.use('/swagger', express.static('./node_modules/swagger-editor/'));

        // redirect page
        app.use('/', express.static('./docs'));
        return app;
    }
};
