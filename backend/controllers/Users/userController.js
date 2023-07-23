const User = require("../../models/Users/user");

exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message:
        err || "Some error occurred while retrieving users."
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(422).send({
        message: "User already exists with email " + req.body.email
      });
    }
    const newUser = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      role: "ADMIN",
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address,
    });
    await newUser.save();
    res.status(200).send({
      message: "User created succssfuly."
    });
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while creating the user." + err
    });
  }
};
exports.updateUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  try {
    await User.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    return res.send({ message: "User was updated successfully." });
  } catch (err) {
    res.status(500).send({
      message: "Error updating user with id=" + req.params.id
    });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.send({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete user with id=" + req.params.id
    });
  }
};
exports.findUserByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "Not found user with email " + email });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving user with email=" + email });
  }
};

exports.findUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};





