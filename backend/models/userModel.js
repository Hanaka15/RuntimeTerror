const { Schema } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
}); 


module.exports = userSchema;