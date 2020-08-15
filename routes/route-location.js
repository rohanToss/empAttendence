const router = require('express').Router();
const locationController = require('../controllers/controller-location');


router.post('/current',locationController.saveCurrentLocation);
router.get('/today/:id',locationController.getlocationDetails);
module.exports = router;