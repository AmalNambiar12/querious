const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');
const dbhandler = require('./app');
const {notFound, errorHandler} = require("./middlerwares/errorMiddleware");
const {protect} = require('./middlerwares/authMiddleware')
dotenv.config();

//connect to DB

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     }
// });


app.get('/api/rooms', protect, async (req,res) => {
    let x = await dbhandler.getRooms();
    res.send(x);
});

app.get('/api/doubts/:roomID', protect, async (req,res) => {
    let room = req.params.roomID;
    let x = await dbhandler.getDoubts(room);
    res.send(x);
});

app.post('/api/doubtsearch/:roomID', protect, async (req,res) => {
    let room = req.params.roomID;
    let search = req.body.search;
    let x = await dbhandler.getDoubtsBySearch(room, search);
    res.send(x);
});

app.post('/api/doubtfilter/:roomID', protect, async (req,res) => {
    let room = req.params.roomID;
    let {username, topic, subtopic} = req.body;
    let x = await dbhandler.getDoubtsByFilter(room, username, topic, subtopic);
    res.send(x);
});

app.get('/api/yourdoubts/:userID', protect, async (req,res) => {
    let user = req.params.userID;
    let x = await dbhandler.getUserDoubts(user);
    res.send(x);
});

app.post('/api/doubts/', protect, async (req,res) => {
    let {userID, roomID, title, date, time, body, imglink, topic, subtopic} = req.body;
    let x = await dbhandler.postDoubt(userID, roomID, title, date, time, body, imglink);
    res.status(200);
});


app.get('/api/solutions/:doubtID', protect, async (req, res) => {
    let doubt = req.params.doubtID;
    let x = await dbhandler.getSolutions(doubt);
    res.send(x);
});

app.post('/api/solutions/', protect, async (req, res) => {;
    let {userID, doubtID, date, time, body, imglink} = req.body;
    let x = await dbhandler.postSolution(userID, doubtID, date, time, body, imglink);
    res.send(x);
});

app.get('/api/profile/:id', protect,  async (req, res) => {
    let profile = req.params.id;
    let x = await getProfile(userID);
    res.send(x);
})

app.use('/api/user', userRoutes);
app.use(notFound);
app.use(errorHandler)


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})