var express = require('express');
var router = express.Router();
const controller = require('../../controllers/urgence/urgence');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })


router.post("/create", controller.create);
router.get("/find-urgence/:longitude/:latitude/", controller.findUrgence);
router.delete("/delete/:id", controller.delete);
router.delete("/delete-all", controller.deleteAll);
router.get("/find-all", controller.findAll);
router.get('/find-by-month', controller.findNbrMonthly);
router.get('/find-by-day', controller.findNbrDaily);
router.get('/find-by-region', controller.findByRegion);


module.exports = router;