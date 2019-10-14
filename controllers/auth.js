const { userModel } = require('../models');
const { jwt } = require('../utils');

function registerGet(req, res) {
    res.render('register.hbs');
}

function registerPost(req, res, next) {
    const { username, password, repeatPassword } = req.body;
    if (password !== repeatPassword) {
        res.render('register.hbs', {
            errors: {
                repeatPassword: 'Password and repeat password don\'t match!'
            }
        });
        return;
    }

    return userModel.create({ username, password })
        .then(() => {
            res.redirect('/login');
        })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                res.render('register.hbs', {
                    errors: {
                        username: 'Username already taken!'
                    }
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
            
        });
}

module.exports = {
    registerGet,
    registerPost,
    loginGet,
    loginPost,
}