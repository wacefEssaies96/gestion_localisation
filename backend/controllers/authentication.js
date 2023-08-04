const User = require('../models/Users/user');
const bcrypt = require('bcrypt-nodejs');
const tokenForUser = require('../utils/tokengenerator');
//sign in
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { // if we didn't get email or password
      return res.send({ message: 'All fields are required' })
    }
    const user = await User.findOne({ email }); // retrieving th user
    if (!user) { // if user not found we send message error
      return res.send({ message: 'Incorrect password or email' })
    }
    const auth = bcrypt.compareSync(password, user.password) // verifying password
    if (!auth) { //if password is incorect
      return res.send({ message: 'Incorrect password or email' })
    }
    const token = tokenForUser(user); // generates new token
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    }); // affecting the token to the cookies of result request that we are sending back 
    res.send({ message: "User logged in successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
