const { userModel } = require('../models');
const { jwt } = require('../utils');
const { authCookieName } = require('../app-config');
const { tokenBlacklist } = require('../models');
const { validationResult } = require('express-validator');

function registerGet(req, res) {
    res.render('register');
}

function registerPost(req, res, next) {
    const { username, password } = req.body;
    let result;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        result = Promise.reject({ name: 'ValidationError', errors: errors.array().map((a) => a = a.msg) });
    } else {
        result = userModel.create({ username, password });
    }

    return result.then(() => {
        res.redirect('/login');
    }).catch(err => {
        if (err.code === 11000) {
            res.render('register', {
                errors: ['Username already taken!'],
                username
            });
            return;
        }
        if (err.name === 'ValidationError') {
            res.render('register', {
                errors: err.errors,
                username
            });
            return;
        };
        next(err);
    });
};

function loginGet(req, res) {
    res.render('login');
}

function loginPost(req, res, next) {
    const { username, password } = req.body;
    userModel.findOne({ username })
        .then(user => Promise.all([user, user.matchPassword(password)]))
        .then(([user, match]) => {
            if (!match) {
                res.render('login', { message: 'Wrong password or username!' });
                return;
            }
            const token = jwt.createToken({ id: user._id });
            res.cookie(authCookieName, token).redirect('/');
        })
        .catch(err => next(err))
}

function logout(req, res) {
    const token = req.cookies[authCookieName];
    tokenBlacklist.create({ token })
        .then(() => {
            res.clearCookie(authCookieName).redirect('/');
        })
}

module.exports = {
    registerGet,
    registerPost,
    loginGet,
    loginPost,
    logout,
}