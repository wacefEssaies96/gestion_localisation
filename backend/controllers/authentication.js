const User = require('../models/Users/user');
const bcrypt = require('bcrypt-nodejs');
const tokenForUser = require('../utils/tokengenerator');

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({ message: 'All fields are required' })
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ message: 'Incorrect password or email' })
    }
    const auth = bcrypt.compareSync(password, user.password)
    if (!auth) {
      return res.send({ message: 'Incorrect password or email' })
    }
    const token = tokenForUser(user);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.send({ message: "User logged in successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
