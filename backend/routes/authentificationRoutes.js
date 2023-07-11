var express = require('express');
var router = express.Router();
const { Login } = require('../controllers/authentication');
const { userVerification } = require('../middlewares/AuthMiddleware');

router.post('/', userVerification)
router.post('/login', Login)

module.exports = router;
