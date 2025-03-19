const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expire: {
        type: Date,
        require: true,
        default: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }
});

module.exports = mongoose.model("Token", TokenSchema);
