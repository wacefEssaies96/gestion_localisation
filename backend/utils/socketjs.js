const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

var Socket = {
    emit: function (event, data) {
        io.emit(event, data);
    },
};

io.on('connection', (socket) => {
    console.log('a user connected');
});

exports.Socket = Socket;
exports.io = io;
