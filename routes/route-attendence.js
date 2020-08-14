const router = require('express').Router();
const controller = require('../controllers/controller-attendence');

router.post('/check-in',controller.checkIn);
router.get('/details/:id',controller.attendenceDetails);
router.get('/monthly-report/:id',controller.monthlyAttendence);
router.put('/check-out',controller.checkOut);


module.exports = router;