const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        
    },

});

userSchema.plugin(passportLocalMongoose); //this will add username and password fields to the userSchema and also add some methods to the userSchema like authenticate, register, etc automatically implemented.

//we are free to add any other fields we want to the userSchema, like name, profile picture, etc.

module.exports = mongoose.model("User", userSchema);