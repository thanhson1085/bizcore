'use strict';
module.exports = function(req, res, next) {

    // alow X-Koor-Application-Id
    res.header('Access-Control-Allow-Headers','X-Koor-Application-Id');

    var koorApplicationId = req.get('X-Koor-Application-Id');

    if (koorApplicationId) {
        req.headers['x-parse-application-id'] = koorApplicationId;
    }
    next();
};
