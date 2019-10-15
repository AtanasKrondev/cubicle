const { cubeModel } = require('../models');

function index(req, res, next) {
    const { from, to, search } = req.query;
    const user = req.user;
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
            res.render('details.hbs', { cube, user })
        })
        .catch(next);
}

function notFound(req, res) {
    const { user } = req;
    res.render('404.hbs', { user });
}

function about(req, res) {
    const { user } = req;
    res.render('about.hbs', { user });
}

function createGet(req, res) {
    res.render('create.hbs')
}

function createPost(req, res) {
    let { name, description, imageUrl, difficultyLevel } = req.body;
    difficultyLevel = +difficultyLevel;
    const { user } = req;
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
            res.render('editCube.hbs', { cube, options });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });;
}

function editPost(req, res) {
    const id = req.params.id;
    let { name, description, imageUrl, difficultyLevel } = req.body;
    difficultyLevel = +difficultyLevel;
    const { user } = req.user;
    cubeModel.updateOne({
        _id: id,
        //  creatorId: user._id
    }, { name, description, imageUrl, difficultyLevel })
        .then(() => { res.redirect('/'); })
        .catch(err => {
            console.log(err);
            res.redirect('/');
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
            res.render('deleteCube.hbs', { cube, options });
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