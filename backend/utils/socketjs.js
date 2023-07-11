const { Server } = require("socket.io");
const { throttle } = require('lodash');

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
    // io.emit("notification", {message: 'hello'})
});

const throttledEmit = throttling(Socket.emit, 10, 5000);



function triggerEmitEvent(event, data) {
    // Call the throttledEmit instead of io.emit
    // throttledEmit(event, data);
    throttling(Socket.emit(event, data), 1, 1000)
}


function throttling(callback, limit, time) {
    /// monitor the count
    var calledCount = 0;

    /// refresh the `calledCount` varialbe after the `time` has been passed
    setInterval(function () { calledCount = 0 }, time);

    /// creating a closure that will be called
    return function () {
        /// checking the limit (if limit is exceeded then do not call the passed function
        if (limit > calledCount) {
            /// increase the count
            calledCount++;
            callback(); /// call the function
        }
        else console.log('not calling because the limit has exceeded');
    };
}
exports.Socket = Socket;
exports.io = io;
exports.triggerEmitEvent = triggerEmitEvent;
