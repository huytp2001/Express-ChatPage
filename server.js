const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Conversation = require('./models/conversation');

const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const dashboardRoute = require('./routes/dashboard');
const logoutRoute = require('./routes/logout');
const searchRoute = require('./routes/search');
const userRoute = require('./routes/user');
const messageRoute = require('./routes/message');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: '0866782970',resave: false,saveUninitialized: true,}));

const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017", {
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log("Connected to mongoose"));

app.use('/', loginRoute);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/dashboard', dashboardRoute);
app.use('/logout', logoutRoute);
app.use('/search', searchRoute);
app.use('/user', userRoute);
app.use('/message', messageRoute);

io.on('connection', (socket) => {
    socket.on('chat-message', async (msg)=>{
        const sub_string = msg.split('|');
        const message_obj = {
            sender: sub_string[0],
            recipient: sub_string[1],
            message: sub_string[2],
            created_at: new Date(),
        };
        try {
            let conversation = await Conversation.findOne({participant: { $all: [sub_string[0], sub_string[1]] }});
            if (!conversation) { 
                const newConversation = new Conversation({
                    participant: [sub_string[0], sub_string[1]],
                    message: []
                });
                await newConversation.save();
                conversation = newConversation;
                conversation.messages.push(message_obj);
                await conversation.save();
            } else {
                conversation.messages.push(message_obj);
                await conversation.save();
            }
        } catch (err) {
            console.log("Error on insert message into db");
        }
        io.emit('chat-message', msg);
    })
});

server.listen(3000); 



