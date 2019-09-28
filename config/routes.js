const cubeController = require('../controllers/cube')

module.exports = (app) => {
    app.get('/', cubeController.index);
    app.get('/details/:id', cubeController.details)
};