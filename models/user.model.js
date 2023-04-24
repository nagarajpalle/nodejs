const { default: mongoose } = require('mongoose');
const mangoose = require('mongoose');

const userSchema = new mangoose.Schema({
    username:{
        type: String,
        require: true,
        min:6,
        max: 255,
    },
    password: {
        type: String,
        require: true,
    }
});

module.exports = mongoose.userSchema;