const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            // Only required if NOT using OAuth
            return !this.googleId && !this.facebookId;
        }
    },
    googleId: String,
    facebookId: String
});

module.exports = mongoose.model("User", userSchema);