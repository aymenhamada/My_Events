const mongoose = require("mongoose");
const Sortie = mongoose.model("Sortie");
const User = mongoose.model("User");
const Message = mongoose.model("Message");
const axios = require("axios");
const { asyncForEach } = require("../helpers");

const appKey = process.env.APP_KEY



exports.createEvent = async (req, res) => {
    let isPublic = req.body.sortie.isPublic;
    if(isPublic == "true"){
        isPublic = true;
    } else{
        isPublic = false;
    }
    let userId = req.body.user;
    let eventID = req.body.eventID;
    let participants = req.body.participants;
    const sortie = await (new Sortie({creatorId: userId, participants: participants, isPublic, eventID})).save();
    res.send(sortie);
}


exports.getEvent = async (req, res) => {
    const {urlID} = req.query;
    const sorties = await Sortie.find({urlID});
    const event = [];
    if(sorties){
        await  asyncForEach(sorties, async (sortie) => {
            let message = await Message.find({eventID: sortie._id}, ['message', 'pseudo']);
            let users = await User.find({$or: [{pseudo: sortie.participants}, {facebookId: sortie.creatorId}]});
            users.forEach(user => {
                if(user.avatar !== null){
                    user.avatar = `assets/${user.avatar}`;
                }
                else{
                    user.avatar = `https://graph.facebook.com/${user.facebookId}/picture?type=large`;
                }
            })
            users.sort((a, b) => {
                if(a.facebookId  == sortie.creatorId){
                    return -1;
                }
                if(b.facebookId == sortie.creatorId){
                    return 1;
                }
                return 0;
            })
            console.log(users);
            let response = await axios.get(`http://api.eventful.com/json/events/get/?app_key=${appKey}&id=${sortie.eventID}`);
            response.data.nombreParticipants = sortie.participants.length + 1;
            response.data.isPublic = sortie.isPublic;
            response.data._id = sortie._id;
            response.data.creatorId = sortie.creatorId;
            response.data.participants = sortie.participants;
            response.data.urlID = sortie.urlID;
            response.data.message = message;
            response.data.user = users
            event.push(response.data);
        })
        return res.send({sorties, event});
    }
    return res.send({error: 'not found'});

}

exports.addNewJoiner = async (req, res) => {
    const {pseudo, event_id} = req.body;
    const sortie = await Sortie.findOneAndUpdate({_id: event_id}, {$push: {participants: pseudo }}, {
        new: true,
        runValidators: true,
    }).exec();
    if(sortie){
        return res.status(200).send({sorties: sortie});
    }
    return res.status(403).send({error: "erorr"});
}


exports.leaveEvent = async(req, res) => {
    const {pseudo, event_id} = req.body;
    const sortie = await Sortie.findOneAndUpdate({_id: event_id}, {$pull: {participants: pseudo}},{
        new: true,
        runValidators: true,
    }).exec();
    if(sortie){
        return res.status(200).send({sorties: sortie});
    }
    return res.status(403).send({error: 'error'});
}

exports.deleteEvent = async (req, res) => {
    const { event_id } = req.body;
    const sortie = await Sortie.deleteOne({_id: event_id});
    return res.status(200).send({message: "destroyed"});
}