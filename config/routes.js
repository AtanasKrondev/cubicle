const cubeController = require('../controllers/cube')

module.exports = (app) => {
    app.get('/', cubeController.index);
    app.get('/details/:id', cubeController.details);
    app.get('/about', cubeController.about);
    app.get('/create', cubeController.createGet);
    app.post('/create', cubeController.createPost)
    app.get('*', cubeController.notFound);
};