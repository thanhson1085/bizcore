'use strict';
module.exports = function(req, res, next) {
    if (req.method === 'GET') {
        for (var key in req.query) {
            req.query['where'] = '{ "' + key + '": "' + req.query[key] + '" }';
            delete req.query[key];
        }
    }
    next();
};
