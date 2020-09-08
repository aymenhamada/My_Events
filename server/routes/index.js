const express = require("express");
const router = express.Router();
const passport = require("passport");
const ApiController = require("../controllers/ApiController");
const SortieController = require("../controllers/SortieController");
const UserController = require("../controllers/UserController");
const MessageController = require("../controllers/MessageController");
const { catchErrors } = require("../errorHandlers");


//Route for facebook authentification
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    res.redirect(`http://localhost:4201/?id=${req.user.facebookId}`);
})

//All route for ApiController
router.get('/api/search/', ApiController.eventSearch);
router.get('/api/get', ApiController.getEvent);
router.get('/api/getWeather', ApiController.getWeather);



//All route for userController
router.get('/api/getUser', catchErrors(UserController.findUser));
router.get('/api/get/user', catchErrors(UserController.getUsers))
router.get('/api/getUserByPseudo', catchErrors(UserController.getUserByPseudo));
router.post('/api/user/changePicture',
    UserController.upload,
    catchErrors(UserController.resize));

router.post('/api/user/putBackFacebookPicture', catchErrors(UserController.putBackFacebookPicture));
router.post('/api/user/completeSignUp', catchErrors(UserController.completeSignUp))
router.post('/api/user/changeDescription', catchErrors(UserController.changeDescription));




//All route for SortieController A.K.A EVENT
router.post('/api/create/event',  catchErrors(SortieController.createEvent))
router.get('/api/get/sortie', catchErrors(SortieController.getEvent));
router.post('/api/event/newJoiner', catchErrors(SortieController.addNewJoiner));
router.post('/api/event/leaveEvent', catchErrors(SortieController.leaveEvent))
router.post('/api/event/deleteEvent', catchErrors(SortieController.deleteEvent));


//Route for message
router.post('/api/event/sendMessage', catchErrors(MessageController.sendMessage));




module.exports = router;