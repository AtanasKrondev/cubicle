global.__basedir = __dirname;
const dbConnector = require('./config/db');
dbConnector().then(() => {
    console.log('Database ready!')
    const config = require('./config/config');
    const app = require('express')();
    require('./config/express')(app);
    require('./config/routes')(app);
    app.use(function (err, req, res, next) {
        console.error(err);
        res.render('500');
    });

    app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
})
    .catch(console.error);
