const env = process.env.NODE_ENV || 'development';
global.__basedir = __dirname;

const cubeModel = require('./models/Cube');

cubeModel.insert({ name: 'Kubcho', difficulty: 'Lesen', price: 'Bezcenen' })
    .then((inserted) => {
        console.log(inserted);
        return cubeModel.delete(inserted.id);
    })
    .then((deletedCube) => {
        console.log('Bravo we');
        console.log(deletedCube);
    });

// const config = require('./config/config')[env];
// const app = require('express')();

// require('./config/express')(app);
// require('./config/routes')(app);

// app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));