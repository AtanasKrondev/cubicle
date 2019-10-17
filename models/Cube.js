const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is empty!'],
        validate: {
            validator: function (v) {
                return v.length >= 5;
            },
            message: props => `${props.value} is not a valid name! Length must be at least 5 symbols!`,
        }
    },
    description: {
        type: String,
        required: [true, 'Description is empty!'],
        validate: {
            validator: function (v) {
                return v.length >= 20;
            },
            message: props => `Description must be at least 20 symbols!`,
        }
    },
    imageUrl: { type: String, required: true },
    difficultyLevel: {
        type: Number,
        required: [true, 'Difficulty not set!'],
        validate: {
            validator: (v) => v >= 1 && v <= 6,
            message: props => `${props.value} is not a valid difficulty! Value must be between 1 and 6!`,
        },
    },
    accessories: [{ type: mongoose.Types.ObjectId, ref: 'Accessory' }],
    creatorId: { type: mongoose.Types.ObjectId, ref: 'User' },
})

cubeSchema.methods.getDescription = function () {
    return this.description;
}

module.exports = mongoose.model('Cube', cubeSchema);