const mongoose = require("mongoose");
require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err) throw err;
    console.log('Connected to database !');
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});


require('./models/User');
require('./models/Sortie');
require('./models/Message');
const Message = mongoose.model("Message");

const app = require('./app');
app.set('port', 4242);



mongoose.connect(process.env.DATABASE)
const server = app.listen(app.get('port'), () => {
    console.log(`🚀 📱 💻 Launched server on localhost:${app.get('port')}`);
});

const io = require("socket.io")(4000);

io.on("connection", socket => {
  socket.on('New joined', (facebookId, Event_id) => {
      socket.join(Event_id);
  })
  socket.on('New message', async (Event_id) => {
    try{
      const message = await Message.find({eventID: Event_id});
      socket.broadcast.to(Event_id).emit("getNewMessage", (message));
    }catch(err){
      console.log(err);
    }
  })
})

