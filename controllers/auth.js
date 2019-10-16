const { userModel } = require('../models');
const { jwt } = require('../utils');
const { authCookieName } = require('../app-config');
const { tokenBlacklist } = require('../models');
const { validationResult } = require('express-validator');

function registerGet(req, res) {
    res.render('register.hbs');
}

function registerPost(req, res, next) {
    let result;
    const errors = validationResult(req);
    const { username, password, repeatPassword } = req.body;
    if (!errors.isEmpty()) {
        result = Promise.reject({ name: 'ValidationError', errors: errors.errors[0].msg });
    } else {
        result = userModel.create({ username, password });
    }
    // if (password !== repeatPassword) {
    //     res.render('register.hbs', {
    //         errors: {
    //             repeatPassword: 'Password and repeat password don\'t match!'
    //         }
    //     });
    //     return;
    // }

    return result.then(() => {
        res.redirect('/login');
    })
        .catch(err => {
            if (err.name === 'ValidationError') {
                res.render('register.hbs', {
                    errors: err.errors,
                });
                return;
            }
            next(err);
        });
}

function loginGet(req, res) {
    res.render('login.hbs');
}

function loginPost(req, res, next) {
    const { username, password } = req.body;
    userModel.findOne({ username })
        .then(user => Promise.all([user, user.matchPassword(password)]))
        .then(([user, match]) => {
            if (!match) {
                res.render('login.hbs', { message: 'Wrong password or username!' });
                return;
            }
            const token = jwt.createToken({ id: user._id });
            res.cookie(authCookieName, token).redirect('/');
        });
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