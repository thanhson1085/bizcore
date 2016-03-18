var express = require('express');
var yaml = require('js-yaml');
var ParseServer = require('parse-server').ParseServer;
var fs = require('fs');
var logger = require('./helpers/logger');

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
    logger.info('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
    databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'myAppId',
    masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'http://localhost:1337'  // Don't forget to change to https if needed
});

var app = express();

// Change Header
app.use(require('./middlewares/headers'));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/koor';
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
    logger.info('parse-server-example running on port ' + port + '.');
});
