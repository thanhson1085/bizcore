var express = require('express');
var yaml = require('js-yaml');
var KoorServer = require('parse-server').ParseServer;
var bodyParser = require('body-parser');
var fs = require('fs');
var logger = require('./helpers/logger');

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
    logger.info('DATABASE_URI not specified, falling back to localhost.');
}

var api = new KoorServer({
    databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'myAppId',
    masterKey: process.env.MASTER_KEY || '',
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/koor'
});

var app = express();

// body parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Change Header
app.use(require('./middlewares/headers'));
app.use(require('./middlewares/params'));

var mountPath = process.env.KOOR_MOUNT || '/koor';
app.use(mountPath, api);

// api-json swagger
app.get('/docs', function(req, res){
    var docs = yaml.safeLoad(fs.readFileSync('./docs/swagger.yml', 'utf8'));
    res.send(JSON.stringify(docs));
});

// add-on swagger-ui
app.use('/swagger', express.static('./node_modules/swagger-editor/'));

// redirect page
app.use('/', express.static('./docs'));

var port = process.env.PORT || 1337;
app.listen(port, function() {
    logger.info('Koor Server running on port ' + port + '.');
});
