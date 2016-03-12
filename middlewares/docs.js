'use strict';
module.exports = function(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }
    next();
};
