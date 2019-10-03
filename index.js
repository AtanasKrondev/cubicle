global.__basedir = __dirname;
const dbConnector = require('./config/db');
dbConnector().then(() => {
    const config = require('./config/config');
    const app = require('express')();
    require('./config/express')(app);
    require('./config/routes')(app);

    app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
})
    .catch(console.error);

// const dbUrl = 'mongodb://localhost:27017';
// const { MongoClient } = require('mongodb');
// const client = new MongoClient(dbUrl);
// client.connect(function (err) {
//     if (err) {
//         console.error(err); return;
//     }

//     const db = client.db('testdb');
//     const users = db.collection('users');
//     // users.insert({ name: 'Test' }).then(user => { console.log(user) });
//     users.deleteMany({ name: 'Test' }).then(deledet => console.log(deledet))
// });

