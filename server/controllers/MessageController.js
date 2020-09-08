const mongoose = require("mongoose");
const Message = mongoose.model("Message");



exports.sendMessage = async (req, res) => {
    const {message, facebookId, eventID, pseudo} = req.body;
    const messageObject = (new Message({authorID: facebookId, message, eventID, pseudo})).save();
    const data = await Message.find({eventID});
    res.send(data);
}