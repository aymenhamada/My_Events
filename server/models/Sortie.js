const mongoose = require("mongoose");
const uuid = require("uuid");
mongoose.Promise = global.Promise;


const sortieSchema = new mongoose.Schema({
    creatorId: String,
    participants: [{
                type: String
    }],
    isPublic: Boolean,
    eventID: String,
    urlID: String,
})

sortieSchema.pre('save', function(){
    this.urlID = uuid.v4();
})



module.exports = mongoose.model("Sortie", sortieSchema);