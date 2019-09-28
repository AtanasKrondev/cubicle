const cubeModel = require('../models/Cube');

function index(req, res, next) {
    cubeModel.getAll()
        .then(cubes => {
            res.render('index.hbs', { cubes });
        })
        .catch(next);
};

function details(req, res, next) {
    const id = +req.params.id;
    cubeModel.getOne(id)
        .then(cube => {
            if (!cube) {
                res.redirect('/not-found');
                return;
            }
            res.render('details.hbs', { cube })
        })
        .catch(next);
}

function notFound(req, res) {
    res.render('404.hbs');
}

function about(req, res) {
    res.render('about.hbs');
}

function createGet(req, res) {
    res.render('create.hbs')
}

function createPost(req, res) {
    const { name, description, imageUrl, difficultyLevel } = req.body;
    const newCube = cubeModel.create(name, description, imageUrl, difficultyLevel);
    cubeModel.insert(newCube)
        .then(() => {
            res.redirect('/');
        });
}

module.exports = {
    index,
    details,
    notFound,
    about,
    createGet,
    createPost
}