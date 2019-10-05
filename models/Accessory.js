const mongoose = require('mongoose');

const accesorySchema = new mongoose.Schema({
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
    cubes: [{ type: mongoose.Types.ObjectId, ref: 'Cube' }],
})

accesorySchema.methods.getDescription = function () {
    return this.description;
}

module.exports = mongoose.model('Accessory', accesorySchema);