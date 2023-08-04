const { Server } = require("socket.io");
// New Web Socket server
const io = new Server({
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
// Declaring socket the take the same event from io
var Socket = {
    emit: function (event, data) {
        io.emit(event, data);
    },
};
//this is only for test purposes
io.on('connection', (socket) => {
    console.log('a user connected');
});

exports.Socket = Socket;
exports.io = io;
