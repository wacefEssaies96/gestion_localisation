const resetPassword = require("../controllers/resetPassword")

var express = require('express');
var router = express.Router();

router.post("/", resetPassword.resetPassword)
router.post("/send", resetPassword.send)

module.exports = router;