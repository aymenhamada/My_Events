const moongoose = require("mongoose");
moongoose.Promise = global.Promise;


const messageSchema = new moongoose.Schema({
    authorID: String,
    eventID: String, //_id object of Sortie
    message: String,
    pseudo: String,
})


module.exports = moongoose.model("Message", messageSchema);