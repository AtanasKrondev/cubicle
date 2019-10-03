const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 2 && v.length <= 20;
            },
            message: props => `${props.value} is not a valid name! Length must be between 2 and 20 symbols!`,
        }
    },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    difficultyLevel: {
        type: Number,
        required: true,
        validate: {
            validator: (v) => v >= 1 && v <= 6,
            message: props => `${props.value} is not a valid difficulty! Value must be between 1 and 6!`,
        },
    }
})

cubeSchema.methods.getDescription = function () {
    return this.description;
}

module.exports = mongoose.model('Cube', cubeSchema);