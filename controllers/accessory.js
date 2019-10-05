const { accessoryModel, cubeModel } = require('../models');

function createGet(req, res) {
    res.render('createAccessory.hbs')
}

function createPost(req, res, next) {
    const { name, description, imageUrl } = req.body;
    accessoryModel.create({ name, description, imageUrl })
        .then((accessory) => {
            res.redirect('/');
        })
        .catch(next);
}

function attachGet(req, res, next) {
    const { id: cubeId } = req.params;
    cubeModel.findById(cubeId)
        .then(cube => Promise.all([cube, accessoryModel.find({ cubes: { $nin: cubeId } })]))
        .then(([cube, fillteredAccessories]) => {
            res.render('attachAccessory.hbs', { cube, accessories: fillteredAccessories });
        })
        .catch(next);
}

function attachPost(req, res, next) {
    const { id } = req.params;
    const { accessory: accessoryId } = req.body;
    Promise
        .all([
            cubeModel.update({ _id: id }, { $push: { accessories: accessoryId } }),
            accessoryModel.update({ _id: accessoryId }, { $push: { cubes: id } })
        ])
        .then(() => {
            res.redirect('/');
        })
        .catch(next);
}

module.exports = {
    createGet,
    createPost,
    attachGet,
    attachPost,
}