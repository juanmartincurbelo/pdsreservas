const { ReservationError } = require("../errors/reservation-errors");
const Reservation = require("../models/reservation");

const getReservations = async (clientId) => {
    try {
        const reservations = await Reservation.find({ client: clientId })
            .sort({ date: 1 });

        return reservations;
    } catch (error) {
        throw new ReservationError(error.message || `Unknown error at getting reservations.`, error.status);
    }
}

const getReservationByBuildingId = async (buildingId) => {
    try {
        const reservations = await Reservation.find({ building: buildingId });
        return reservations;
    } catch (error) {
        throw new ReservationError(error.message || `Unknown error at getting reservations from building`, error.status);
    }
}

const createReservation = async (reservation) => {
    try {
        const createdReservation = await Reservation.create(reservation);
        return createdReservation;
    } catch (error) {
        throw new ReservationError(error.message || `Unknown error at creating reservation.`, error.status);
    }
}

const checkBuildingAvailability = async (reservation) => {
    try {
        const existsReservation = await Reservation.findOne({
            building: reservation.building,
            date: reservation.date,
            time: reservation.time,
        });

        return existsReservation;
    } catch (error) {
        throw new ReservationError(error.message || `Unknown error at checking building availability.`, error.status);
    }
}

const getReservationById = async (id) => {
    try {
        const reservation = await Reservation.findById(id);

        return reservation;
    } catch (error) {
        throw new ReservationError(error.message || `Unknown error at getting reservation by id.`, error.status);
    }
}

const updateReservation = async (reservationData) => {
    try {
        const reservation = await Reservation.findById(reservationData._id);

        reservation.date = reservationData.date;
        reservation.time = reservationData.time;
        reservation.fireWood = reservationData.fireWood;

        const updatedReservation = await reservation.save();

        return updatedReservation;
    } catch (error) {
        throw new ReservationError(error.message || `Unknown error at updating reservation.`, error.status);
    }
}

const deleteReservationsByDateRange = async (buildingId, startDate, endDate) => {
    try {
        const reservationsToDelete = await Reservation.find({
            building: buildingId,
            date: { $gte: startDate, $lte: endDate },
        });

        await Reservation.deleteMany({
            building: buildingId,
            date: { $gte: startDate, $lte: endDate },
        });
        return reservationsToDelete;
    } catch (error) {
        throw new ReservationError(error.message || `Unknown error at deleting reservations by date range.`, error.status);
    }
}

const createReservations = async (reservations) => {
    try {
        const createdReservations = await Reservation.insertMany(reservations);
        return createdReservations;
    } catch (error) {
        throw new ReservationError(error.message || `Unknown error at creating reservations.`, error.status);
    }
}

const deleteReservation = async (id) => {
    try {
        const reservation = await Reservation.findByIdAndRemove(id);

        return reservation;
    } catch (error) {
        throw new ReservationError(error.message || `Unknown error at deleting reservation.`, error.status);
    }
}

const getReservationByDateAndTime = async (date, time) => {
    try {
        const reservations = await Reservation.findOne({
            date: date,
            time: time,
        });

        return reservations;
    } catch (error) {
        throw new ReservationError(error.message || `Unknown error at getting reservations by date and time.`, error.status);
    }
}

module.exports = {
    createReservation,
    checkBuildingAvailability,
    getReservations,
    getReservationByBuildingId,
    getReservationById,
    updateReservation,
    deleteReservationsByDateRange,
    createReservations,
    deleteReservation,
    getReservationByDateAndTime,
}
