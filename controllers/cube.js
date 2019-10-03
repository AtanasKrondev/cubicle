const cubeModel = require('../models/cube');

function index(req, res, next) {
    const { from, to, search } = req.query;
    let query = {
        name: new RegExp(search, 'i'),
    }

    if (from || to) {
        query.difficultyLevel = {};
        if (from) {
            query.difficultyLevel.$gte = from;
        }
        if (to) {
            query.difficultyLevel.$lte = to;
        }
    }
    cubeModel.find(query)
        .then(cubes => {
            res.render('index.hbs', {
                cubes,
                search,
                from,
                to,
            });
        })
        .catch(next);
};

function details(req, res, next) {
    const id = req.params.id;
    cubeModel.findById(id)
        .then(found => {
            const cube = found;
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
    let { name, description, imageUrl, difficultyLevel } = req.body;
    difficultyLevel = +difficultyLevel;
    cubeModel.create({ name, description, imageUrl, difficultyLevel })
        .then((cube) => {
            console.log(cube);
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/create');
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