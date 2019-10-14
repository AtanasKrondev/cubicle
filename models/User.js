const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = 'tainimakari';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return v.length >= 2 && v.length <= 20;
            },
            message: props => `${props.value} is not a valid username! Length must be between 2 and 20 symbols!`,
        }
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password)
    }
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                next(err);
                return;
            };
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    next(err);
                    return;
                };
                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);