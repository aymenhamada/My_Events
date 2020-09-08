const mongoose = require("mongoose");
mongoose.Promise = global.Promise;



const userSchema = new mongoose.Schema({
    facebookId:{
        type: String,
        unique: true,
    },
    name:{
        type: String,
    },
    email:{
        type: String,
    },
    pseudo:{
        type: String,
    },
    avatar:{
        type: String,
    },
    hometown:{
        type: String,
    },
    description:{
        type: String,
    }
})

module.exports = mongoose.model("User", userSchema);