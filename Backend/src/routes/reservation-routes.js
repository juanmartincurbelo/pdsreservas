const express = require('express');
const router = express.Router();

const PdsConstants = require('../utils/constants');
const _reservationController = require('../controllers/reservation-controller');
const authentication = require('../middleware/authentication');

router.get('/', authentication([PdsConstants.CLIENT_ROLE]), _reservationController.getReservations);
router.get('/building/:id', authentication([PdsConstants.ADMIN_ROLE, PdsConstants.CLIENT_ROLE]), _reservationController.getReservationByBuildingId);
router.get('/:id', authentication([PdsConstants.CLIENT_ROLE]), _reservationController.canCancelReservationForFree);
router.get('/can-edit/:id', authentication([PdsConstants.CLIENT_ROLE]), _reservationController.canEditReservation);
router.post('/', authentication([PdsConstants.CLIENT_ROLE]), _reservationController.createReservation);
router.put('/:id', authentication([PdsConstants.CLIENT_ROLE]), _reservationController.updateReservation);
router.delete('/:id', authentication([PdsConstants.CLIENT_ROLE]), _reservationController.cancelReservation);

module.exports = router;