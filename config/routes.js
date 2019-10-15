const cubeController = require('../controllers/cube');
const accessoryController = require('../controllers/accessory');
const authController = require('../controllers/auth');
const { auth } = require('../utils');

module.exports = (app) => {
    app.get('/register', auth(false), authController.registerGet);
    app.post('/register', authController.registerPost);
    app.get('/login', auth(false), authController.loginGet);
    app.post('/login', authController.loginPost);
    app.get('/logout', authController.logout)
    app.get('/create/accessory', auth(), accessoryController.createGet);
    app.post('/create/accessory', auth(), accessoryController.createPost);
    app.get('/attach/accessory/:id', auth(), accessoryController.attachGet);
    app.post('/attach/accessory/:id', auth(), accessoryController.attachPost);
    app.get('/about', auth(false), cubeController.about);
    app.get('/create', auth(), cubeController.createGet);
    app.post('/create', auth(), cubeController.createPost);
    app.get('/edit/:id', auth(), cubeController.editGet);
    app.post('/edit/:id', auth(), cubeController.editPost);
    app.get('/delete/:id', auth(), cubeController.deleteGet);
    app.post('/delete/:id', auth(), cubeController.deletePost);
    app.get('/details/:id', auth(false), cubeController.details);
    app.get('/', auth(false), cubeController.index);
    app.get('*', auth(false), cubeController.notFound);
};
