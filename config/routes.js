const cubeController = require('../controllers/cube');
const accessoryController = require('../controllers/accessory');
const authController = require('../controllers/auth');

module.exports = (app) => {
    app.get('/register', authController.registerGet);
    app.post('/register', authController.registerPost);
    app.get('/login', authController.loginGet);
    app.post('/login', authController.loginPost);
    app.get('/create/accessory', accessoryController.createGet);
    app.post('/create/accessory', accessoryController.createPost);
    app.get('/attach/accessory/:id', accessoryController.attachGet);
    app.post('/attach/accessory/:id', accessoryController.attachPost);
    app.get('/details/:id', cubeController.details);
    app.get('/about', cubeController.about);
    app.get('/create', cubeController.createGet);
    app.post('/create', cubeController.createPost);
    app.get('/', cubeController.index);
    app.get('*', cubeController.notFound);
};
