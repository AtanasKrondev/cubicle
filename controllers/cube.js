const { cubeModel } = require('../models');

function index(req, res, next) {
    const { from, to, search } = req.query;
    const { user } = req;
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
            res.render('index', {
                cubes,
                search,
                from,
                to,
                user
            });
        })
        .catch(next);
};

function details(req, res, next) {
    const id = req.params.id;
    const { user } = req;
    cubeModel.findById(id).populate('accessories')
        .then(found => {
            const cube = found;
            if (!cube) {
                res.redirect('/not-found');
                return;
            }
            res.render('details', { cube, user })
        })
        .catch(next);
}

function notFound(req, res) {
    const { user } = req;
    res.render('404', { user });
}

function about(req, res) {
    const { user } = req;
    res.render('about', { user });
}

function createGet(req, res) {
    const { user } = req;
    res.render('create', { user })
}

function createPost(req, res) {
    const { user } = req;
    let { name, description, imageUrl, difficultyLevel } = req.body;
    difficultyLevel = +difficultyLevel;
    cubeModel.create({ name, description, imageUrl, difficultyLevel, creatorId: user._id })
        .then((cube) => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/create');
        });
}

function editGet(req, res) {
    const { user } = req;
    const id = req.params.id;
    cubeModel.findOne({
        _id: id,
        //  creatorId: user._id 
    })
        .then(cube => {
            const options = [
                { value: 1, title: '1 - Very Easy', selected: 1 === cube.difficultyLevel },
                { value: 2, title: '2 - Easy', selected: 2 === cube.difficultyLevel },
                { value: 3, title: '3 - Medium (Standard 3x3)', selected: 3 === cube.difficultyLevel },
                { value: 4, title: '4 - Intermediate', selected: 4 === cube.difficultyLevel },
                { value: 5, title: '5 - Expert', selected: 5 === cube.difficultyLevel },
                { value: 6, title: '6 - Hardcore', selected: 6 === cube.difficultyLevel }
            ];
            res.render('editCube', { cube, options, user });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });;
}

function editPost(req, res, next) {
    const id = req.params.id;
    let { name, description, imageUrl, difficultyLevel } = req.body;
    difficultyLevel = +difficultyLevel;
    const { user } = req;
    cubeModel.updateOne({
        _id: id,
        //  creatorId: user._id
    }, { name, description, imageUrl, difficultyLevel }, { runValidators: true })
        .then(() => { res.redirect('/'); })
        .catch(err => {
            if (err.name === 'ValidationError') {
                res.render('editCube', {
                    cube: { name, description, imageUrl, difficultyLevel },
                    errors: err.errors,
                });
                return;
            }
            next(err);
        });;
}

function deleteGet(req, res) {
    const id = req.params.id;
    const { user } = req;
    cubeModel.findOne({
        _id: id,
        //  creatorId: user._id 
    })
        .then(cube => {
            const options = [
                { value: 1, title: '1 - Very Easy', selected: 1 === cube.difficultyLevel },
                { value: 2, title: '2 - Easy', selected: 2 === cube.difficultyLevel },
                { value: 3, title: '3 - Medium (Standard 3x3)', selected: 3 === cube.difficultyLevel },
                { value: 4, title: '4 - Intermediate', selected: 4 === cube.difficultyLevel },
                { value: 5, title: '5 - Expert', selected: 5 === cube.difficultyLevel },
                { value: 6, title: '6 - Hardcore', selected: 6 === cube.difficultyLevel }
            ];
            res.render('deleteCube', { cube, options, user });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });;
}

function deletePost(req, res) {
    const id = req.params.id;
    let { name, description, imageUrl, difficultyLevel } = req.body;
    difficultyLevel = +difficultyLevel;
    const { user } = req.user;
    cubeModel.deleteOne({
        _id: id,
        //  creatorId: user._id
    })
        .then(() => { res.redirect('/'); })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });;
}

module.exports = {
    index,
    details,
    notFound,
    about,
    createGet,
    createPost,
    editGet,
    editPost,
    deleteGet,
    deletePost
}