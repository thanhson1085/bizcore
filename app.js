'use strict';

var config = require('config');
var express = require('express');
var db = require('./models');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var bodyParser = require('body-parser');
var app = express();
var logger = require('./utils/logger');
var morgan = require('morgan')({ 'stream': logger.stream });

// set views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// add-on swagger-ui
app.use('/swagger', express.static('./node_modules/swagger-ui/dist'));

// redirect page
app.use('/', express.static('./docs'));

// body parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// api-json swagger
app.get('/docs', function(req, res){
    var docs = yaml.safeLoad(fs.readFileSync('./docs/swagger.yml', 'utf8'));
    res.send(JSON.stringify(docs));
});

// images
app.use('/upload', express.static(path.join(__dirname, '/upload')));

// add modification header
app.use(function(req, res, next){
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// enabled logger
app.use(morgan);

// auth
app.use(require('./middlewares/users'));
app.use(require('./apis'));

// Start web server at port 3000
db.sequelize.sync().then(function () {
    var port = config.get('server.port');
    var server = app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;
        logger.info('Server start at http://%s:%s', host, port);
    });
});

