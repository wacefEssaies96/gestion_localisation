const jwt = require('jwt-simple');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    const token = jwt.encode({ sub: user._id, iat: timestamp }, process.env.JWT_SECRET);
    return token;
}

module.exports = tokenForUser