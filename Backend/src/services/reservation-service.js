const _reservationRepository = require("../repositories/reservation-repository");
const _buildingRepository = require("../repositories/building-repository");
const _clientRepository = require("../repositories/client-repository");

const { ReservationError, BadRequestError } = require("../errors/reservation-errors");
const PdsConstants = require("../utils/constants");
const { isUndefinedOrNull, isDefined } = require("../utils/validator");

const getReservations = async (clientId) => {
    try {
        _clientRepository.getClientById(clientId);
        const reservations = await _reservationRepository.getReservations(clientId);

        const currentDate = new Date();

        reservations.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            dateA.setMinutes(dateA.getMinutes() + dateA.getTimezoneOffset());
            dateB.setMinutes(dateB.getMinutes() + dateB.getTimezoneOffset());

            if (dateA.toDateString() === currentDate.toDateString()
                && dateB.toDateString() === currentDate.toDateString()) {
                if (a.time === "Day") {
                    return -1;
                } else {
                    return 1;
                }
            } else if (dateA.toDateString() === currentDate.toDateString()) {
                return -1;
            } else if (dateB.toDateString() === currentDate.toDateString()) {
                return 1;
            } else if (dateA < currentDate && dateB < currentDate) {
                return dateB - dateA;
            } else if (dateA < currentDate) {
                return 1;
            } else if (dateB < currentDate) {
                return -1;
            } else {
                return dateA - dateB;
            }
        });

        return reservations;
    } catch (error) {
        throw new ReservationError(error.message, error.status);
    }
};

const getReservationByBuildingId = async (buildingId) => {
    try {
        await _buildingRepository.getBuildingById(buildingId);
        const reservations = await _reservationRepository.getReservationByBuildingId(buildingId);

        return reservations;
    } catch (error) {
        throw new ReservationError(error.message, error.status);
    }
}

const createReservation = async (reservation, clientId) => {
    try {
        validateReservation(reservation);
        const building = await _buildingRepository.getBuildingById(reservation.building);

        if (!building) {
            throw new BadRequestError("El edificio no existe");
        };

        const client = await _clientRepository.getClientById(clientId);

        if (building._id.toString() !== client.building.toString()) {
            throw new BadRequestError("No puedes reservar en este edificio");
        }

        await validateBuildingAvailability(reservation);

        reservation.client = client._id;
        const createdReservation = await _reservationRepository.createReservation(reservation);

        return createdReservation;
    } catch (error) {
        throw new ReservationError(error.message, error.status);
    }
}

const validateReservation = (reservation) => {
    if (isUndefinedOrNull(reservation.date) || isUndefinedOrNull(reservation.time) || isUndefinedOrNull(reservation.building)
        || isUndefinedOrNull(reservation.acceptedTerms) || isUndefinedOrNull(reservation.fireWood)) {
        throw new BadRequestError("Datos inválidos");
    }

    if (!isDayReservation(reservation.time) && !isNightReservation(reservation.time)) {
        throw new BadRequestError("La hora de la reserva es inválida. Debe ser Día o Noche.");
    }

    if (!reservation.acceptedTerms) {
        throw new BadRequestError("Debes aceptar los términos y condiciones");
    }

    validateReservationDate(reservation);
}

const validateReservationDate = (reservation) => {
    const reservationDateInMiliseconds = new Date(reservation.date).getTime();
    const today = new Date().getTime();
    const now = today - PdsConstants.THREE_HOURS_IN_MILLISECONDS;

    const yesterday = new Date(now);
    yesterday.setUTCHours(0, 0, 0, 0);
    const yesterdayInMiliseconds = yesterday.getTime();

    if (reservationDateInMiliseconds < yesterdayInMiliseconds) {
        throw new BadRequestError("La fecha de la reserva no puede ser menor a la fecha actual");
    }

    if (reservationDateInMiliseconds + PdsConstants.ONE_DAY_IN_MILLISECONDS > now) {
        if (isDayReservation(reservation.time) && reservationDateInMiliseconds + PdsConstants.TWELVE_HOURS_IN_MILLISECONDS < now) {
            throw new BadRequestError("Ya no es posible reservar la barbacoa para el día");
        } else if (isNightReservation(reservation.time) && reservationDateInMiliseconds + PdsConstants.TWENTY_HOURS_IN_MILLISECONDS < now) {
            throw new BadRequestError("Ya no es posible reservar la barbacoa para la noche");
        }
    }
}

const validateBuildingAvailability = async (reservation) => {
    try {
        const existsReservation = await _reservationRepository.checkBuildingAvailability(reservation);

        if (existsReservation && reservation._id?.toString() !== existsReservation._id.toString()) {
            throw new BadRequestError("Ya existe una reserva para ese día y horario");
        }
    } catch (error) {
        throw new ReservationError(error.message, error.status);
    }
}

const updateReservation = async (reservationInput, reservationId) => {
    try {
        const reservation = await _reservationRepository.getReservationById(reservationId);

        if (!reservation) {
            throw new BadRequestError("La reserva no existe");
        }

        const canModifyRservation = canModifyReservation(reservation);
        if (!canModifyRservation) {
            throw new BadRequestError("Ya no es posible modificar la reserva");
        }

        validateUpdateReservationInput(reservationInput);
        const updatedReservation = updateReservationData(reservationInput, reservation);
        await validateBuildingAvailability(updatedReservation);
        const savedReservation = await _reservationRepository.updateReservation(updatedReservation);

        return savedReservation;
    } catch (error) {
        throw new ReservationError(error.message, error.status);
    }
}

const canModifyReservation = (reservation) => {
    const reservationDateInMiliseconds = new Date(reservation.date).getTime();
    let exactReservationDateInMiliseconds;

    if (isDayReservation(reservation.time)) {
        exactReservationDateInMiliseconds = reservationDateInMiliseconds + PdsConstants.TWELVE_HOURS_IN_MILLISECONDS;
    } else if (isNightReservation(reservation.time)) {
        exactReservationDateInMiliseconds = reservationDateInMiliseconds + PdsConstants.TWENTY_HOURS_IN_MILLISECONDS;
    }

    const today = new Date().getTime();
    const now = today - PdsConstants.THREE_HOURS_IN_MILLISECONDS;

    return exactReservationDateInMiliseconds - now > PdsConstants.ONE_DAY_IN_MILLISECONDS;
}

const validateUpdateReservationInput = (reservationInput) => {
    if (isUndefinedOrNull(reservationInput.date) && isUndefinedOrNull(reservationInput.time) &&
        isUndefinedOrNull(reservationInput.acceptedTerms) && isUndefinedOrNull(reservationInput.fireWood)) {
        throw new BadRequestError("No se ingresaron datos para modificar la reserva");
    }

    if (isDefined(reservationInput.time) && !isDayReservation(reservationInput.time) && !isNightReservation(reservationInput.time)) {
        throw new BadRequestError("La hora de la reserva es inválida. Debe ser Día o Noche.");
    }

    if (isDefined(reservationInput.acceptedTerms) && !reservationInput.acceptedTerms) {
        throw new BadRequestError("Debes aceptar los términos y condiciones");
    }

    validateReservationDate(reservationInput);
}

const updateReservationData = (reservationInput, reservation) => {
    try {
        if (isDefined(reservationInput.date)) {
            reservation.date = reservationInput.date;
        }

        if (isDefined(reservationInput.time)) {
            reservation.time = reservationInput.time;
        }

        if (isDefined(reservationInput.fireWood)) {
            reservation.fireWood = reservationInput.fireWood;
        }

        return reservation;
    } catch (error) {
        throw new ReservationError(error.message, error.status);
    }
}

const deleteReservation = async (reservationId) => {
    try {
        const reservation = await _reservationRepository.getReservationById(reservationId);

        if (!reservation) {
            throw new BadRequestError("La reserva no existe");
        }

        const canceledReservation = await _reservationRepository.deleteReservation(reservationId)

        return canceledReservation;
    } catch (error) {
        throw new ReservationError(error.message, error.status);
    }
}

const canCancelReservationForFree = async (reservationId) => {
    try {
        const reservation = await _reservationRepository.getReservationById(reservationId);

        if (!reservation) {
            throw new BadRequestError("La reserva no existe");
        }

        const canCancelReservationForFree = canModifyReservation(reservation);

        return canCancelReservationForFree;
    } catch (error) {
        throw new ReservationError(error.message, error.status);
    }
}


const isDayReservation = (time) => {
    return time == "Day";
}

const isNightReservation = (time) => {
    return time == "Night";
}

const getReservationByDateAndTime = (date, time) => {
    try {
        const reservations = _reservationRepository.getReservationByDateAndTime(date, time);

        return reservations;
    } catch (error) {
        throw new ReservationError(error.message, error.status);
    }
}

const canEditReservation = async (reservationId) => {
    try {
        const reservation = await _reservationRepository.getReservationById(reservationId);

        if (!reservation) {
            throw new BadRequestError("La reserva no existe");
        }

        const canEditReservation = canModifyReservation(reservation);

        if (!canEditReservation) {
            throw new BadRequestError("Ya no es posible modificar la reserva");
        }

        return canEditReservation;
    } catch (error) {
        throw new ReservationError(error.message, error.status);
    }
}

module.exports = {
    createReservation,
    getReservations,
    getReservationByBuildingId,
    updateReservation,
    deleteReservation,
    canCancelReservationForFree,
    getReservationByDateAndTime,
    canEditReservation,
}
