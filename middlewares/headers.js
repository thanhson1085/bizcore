'use strict';
module.exports = function(req, res, next) {
    res.header('X-Koor-Application-Id');
    console.log(req.get('X-Koor-Application-Id'));
    var koorApplicationId = req.get('X-Koor-Application-Id');

    if (koorApplicationId) {
        res.setHeader('X-Parse-Application-Id', koorApplicationId);
    }
    next();
};
