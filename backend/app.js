const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const { io } = require("./utils/socketjs");


const usersRouter = require('./routes/Users/userRoutes');
const urgenceRouter = require('./routes/urgence/urgence');

const authRouter = require('./routes/authentificationRoutes');
//send email route
const resetPassword = require('./routes/resetPasswordRoute');

var app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.enable('trust proxy');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/urgences', urgenceRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/resetpwd', resetPassword);

app.use('/uploads', express.static('uploads'));


//connect to mongo database
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database! ');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ error: err });
});

app.set('port', 3030);
var server = http.createServer(app);
server.listen(3030);
io.attach(server);
module.exports = app;
