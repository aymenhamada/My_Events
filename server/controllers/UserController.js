const mongoose = require("mongoose");
const User = mongoose.model("User");
const Sortie = mongoose.model("Sortie");
const axios = require("axios");
const multer = require("multer");
const jimp = require("jimp");
const { asyncForEach } = require("../helpers");


require("dotenv").config({path: '../variables.env'});
const appKey = process.env.APP_KEY


const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next){
        const isPhoto = file.mimetype.startsWith('/image');
        if(isPhoto){
            next(null, true);
        } else{
            next({message: 'That file type is not allowed'}, false);
        }
    }
}

exports.upload = multer().single("photo");

exports.resize = async (req, res) => {
    if(!req.file) return res.send("Wrong file type");

    const extension = req.file.mimetype.split('/')[1];
    const picname = `${req.file.originalname}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`../front-end/src/assets/${picname}`);
    const user = await User.findOneAndUpdate({facebookId: req.file.originalname}, {avatar: picname},{
        new: true,
        runValidators: true,
    }).exec();;
    return res.send({user});
}

exports.getUsers = async (req, res) => {
    const { facebookId } = req.query;
    let users = await User.find({}, ['pseudo', 'facebookId'],);
    users = users.filter(ele => {
        return ele.facebookId != facebookId;
    })
    res.send({user: users});
}


exports.findUser = async (req, res) => {
    const {needEvent, id } = req.query;
    let event = [];
    const user = await User.findOne({facebookId: id});
    if(needEvent == "true"){
        const sorties = await Sortie.find({$or:[
                                                 {participants: user.pseudo},
                                                 {creatorId: user.facebookId}
                                               ]});
        await asyncForEach(sorties, async (sortie) =>{
            let response = await axios.get(`http://api.eventful.com/json/events/get/?app_key=${appKey}&id=${sortie.eventID}`);
            response.data.nombreParticipants = sortie.participants.length + 1;
            response.data.isPublic = sortie.isPublic;
            response.data._id = sortie._id;
            response.data.creatorId = sortie.creatorId;
            response.data.participants = sortie.participants;
            response.data.urlID = sortie.urlID
            event.push(response.data);
        })
    }
    if(user){
           return res.send({user, sorties: event});
    }
    res.send({error: "Wrong id"});
}


exports.putBackFacebookPicture = async (req, res) => {
    const { facebookId } = req.body;

    const user = await User.findOneAndUpdate({facebookId}, {avatar: null},{
        new: true,
        runValidators: true,
    }).exec();
    return res.send(user);
}

exports.completeSignUp = async (req, res) => {
    let {pseudo, description, facebookId} = req.body;
    const findFirstUser = await User.findOne({pseudo});

    if(!findFirstUser){
        const user = await User.findOneAndUpdate({facebookId}, {pseudo, description},{
            new: true,
            runValidators: true,
        }).exec();
        return res.send({user});
    }
    return res.send({error: 'pseudo already taken'});
}


exports.changeDescription = async (req, res) => {
    const {description, facebookId} = req.body;

    const user = await User.findOneAndUpdate({facebookId}, {description},{
        new: true,
        runValidators: true,
    }).exec();
    return res.send({user});
}


exports.getUserByPseudo = async (req, res) => {
    const { pseudo } = req.query;
    let event = [];

    const user = await User.findOne({pseudo})
    if(user){
        const sorties = await Sortie.find({$or:[
                                                {participants: pseudo},
                                                {creatorId: user.facebookId}
                                               ]});
        await asyncForEach(sorties, async (sortie) => {
            let response = await axios.get(`http://api.eventful.com/json/events/get/?app_key=${appKey}&id=${sortie.eventID}`);
            response.data.nombreParticipants = sortie.participants.length + 1;
            response.data.isPublic = sortie.isPublic;
            response.data._id = sortie._id;
            response.data.creatorId = sortie.creatorId;
            response.data.participants = sortie.participants;
            response.data.urlID = sortie.urlID
            event.push(response.data);
        })
        return res.send({user, sorties: event});
    }
    return res.send({error: "user not found"});
}