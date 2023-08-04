const resetPassword = require("../controllers/resetPassword")
var express = require('express');
var router = express.Router();
//reset pwd routes
router.post("/", resetPassword.resetPassword)
router.post("/send", resetPassword.send)

module.exports = router;