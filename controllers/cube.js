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
            res.render('details.hbs', { cube })
        })
        .catch(next);
}

module.exports = {
    index,
    details
}