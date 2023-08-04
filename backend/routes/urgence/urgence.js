var express = require('express');
var router = express.Router();
const controller = require('../../controllers/urgence/urgence');
//const multer = require('multer');
//const upload = multer({ dest: 'uploads/' })

// Create or update emergency
router.post("/create", controller.create);
// Retrieve emergency by coords
router.get("/find-urgence/:longitude/:latitude/", controller.findUrgence);
// Remove one emergency
router.delete("/delete/:id", controller.delete);
// Remove all emergencies 
router.delete("/delete-all", controller.deleteAll);
// Retrieve all emergencies
router.get("/find-all", controller.findAll);
// Retrieve emergencies monthly 
router.get('/find-by-month', controller.findNbrMonthly);
// Retrive emergencies daily
router.get('/find-by-day', controller.findNbrDaily);
// Retrive emergencies per area
router.get('/find-by-region', controller.findByRegion);
// return if we fond coords in maritim area
router.post('/is-in-area', controller.isInRegion);

module.exports = router;