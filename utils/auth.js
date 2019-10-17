const jwt = require('./jwt');
const { authCookieName } = require('../app-config');
const { userModel } = require('../models');
const { tokenBlacklist } = require('../models');

function auth(redirectUnaunthenticted = true) {
    return function (req, res, next) {
        const token = req.cookies[authCookieName] || '';
        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklist.findOne({ token })
        ])
            .then(([data, blacklistedToken]) => {
                if (blacklistedToken) {
                    return Promise.reject(new Error('blacklisted token'));
                }
                userModel.findById(data.id)
                    .then(user => {
                        req.user = user;
                        next();
                    });
            })
            .catch(err => {
                if (!redirectUnaunthenticted) { next(); return; };
                if (['token expired', 'blacklisted token', 'jwt must be provided', 'jwt expired'].includes(err.message)) {
                    res.redirect('/login');
                    return;
                }
                next(err);
            });
    };
};

module.exports = auth;