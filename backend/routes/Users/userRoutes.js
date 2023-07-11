var express = require('express');
var router = express.Router();
const user = require("../../controllers/Users/userController.js");
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' })

// Retrieve all Users
router.get("/find-all", user.findAllUsers);
// Retrieve a single User with email
router.get("/email/:email", user.findUserByEmail);
// Retrieve a single User with id
router.get("/find/:id", user.findUserById);
// Create a new User
router.post("/create", user.createUser);
// Update a User with id
router.put("/update/:id", user.updateUser);
// Delete a User with id
router.delete("/delete/:id", user.deleteUser);

module.exports = router; 