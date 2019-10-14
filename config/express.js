const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const secret = 'tainimakari';
// const bodyParser = require('body-parser');

module.exports = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser(secret))
    app.use(express.static(path.resolve(__basedir, 'static')));
    app.engine('.hbs', handlebars({ extName: '.hbs', defaultLayout: false }));
    app.set('views', path.resolve(__basedir, 'views'));
};
