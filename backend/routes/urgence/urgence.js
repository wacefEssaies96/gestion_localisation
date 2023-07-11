var express = require('express');
var router = express.Router();
const controller = require('../../controllers/urgence/urgence');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })


router.post("/create", controller.create);
router.get("/find-urgence/:longetude/:latitude/", controller.findUrgence);
router.delete("/delete/:id", controller.delete);
router.delete("/delete-all", controller.deleteAll);
router.get("/find-all", controller.findAll);
// router.get('/search', controller.searchArticle);

module.exports = router;