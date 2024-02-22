const _reservationService = require('../services/reservation-service');

const getReservations = async (req, res) => {
    try {
        const clientId = req.user.user_id;

        const reservations = await _reservationService.getReservations(clientId);
        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const getReservationByBuildingId = async (req, res) => {
    try {
        const buildingId = req.params.id;

        const reservations = await _reservationService.getReservationByBuildingId(buildingId);
        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const createReservation = async (req, res) => {
    try {
        const reservation = req.body;
        const clientId = req.user.user_id;

        const createdreservation = await _reservationService.createReservation(reservation, clientId);
        res.status(200).json({ success: true, data: createdreservation });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const updateReservation = async (req, res) => {
    try {
        const reservation = req.body;
        const reservationId = req.params.id;

        const updatedReservation = await _reservationService.updateReservation(reservation, reservationId);
        res.status(200).json({ success: true, data: updatedReservation });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });

    }
}

const canCancelReservationForFree = async (req, res) => {
    try {
        const reservationId = req.params.id;

        const canCancelReservation = await _reservationService.canCancelReservationForFree(reservationId);
        res.status(200).json({ success: true, data: canCancelReservation });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}


const cancelReservation = async (req, res) => {
    try {
        const reservationId = req.params.id;

        const canCancelReservationForFree = await _reservationService.deleteReservation(reservationId);
        res.status(200).json({ success: true, data: canCancelReservationForFree });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const canEditReservation = async (req, res) => {
    try {
        const reservationId = req.params.id;

        const canEditReservation = await _reservationService.canEditReservation(reservationId);
        res.status(200).json({ success: true, data: canEditReservation });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

module.exports = {
    createReservation,
    getReservations,
    getReservationByBuildingId,
    updateReservation,
    cancelReservation,
    canCancelReservationForFree,
    canEditReservation,
};