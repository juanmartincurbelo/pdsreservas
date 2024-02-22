const _notificationRepository = require("../repositories/notification-repository");

const { NotificationError } = require("../errors/notification-errors");
const PdsConstants = require("../utils/constants");
const { getCurrentTime, dateToString, isDayReservation, fullDateToString } = require("../utils/common");
const { isDefined } = require("../utils/validator");

const createNotification = async (reservation) => {
    try {
        const notification = {
            client: reservation.client,
            reservation: reservation._id,
            time: getCurrentTime(),
            title: PdsConstants.ONE_DAY_LEFT_RESERVATION_NOTIFICATION_TITLE,
            message: PdsConstants.ONE_DAY_LEFT_RESERVATION_NOTIFICATION_MESSAGE,
        }

        await _notificationRepository.createNotification(notification);
    } catch {
        throw new NotificationError(error.message, error.status);
    }
}

const getNotifications = async (clientId) => {
    try {
        const notifications = await _notificationRepository.getNotifications(clientId);

        return notifications;
    } catch (error) {
        throw new NotificationError(error.message, error.status);
    }
}

const createNotificationForBuildingClients = async (clientId, reason, startDate, endDate) => {
    try {
        const notification = {
            client: clientId,
            time: getCurrentTime(),
            title: PdsConstants.BUILDING_DISABLED_NOTIFICATION_TITLE,
            message: "Fechas: " + dateToString(startDate) + " - " + dateToString(endDate) + ". Motivo: " + reason,
        }

        await _notificationRepository.createNotification(notification);
    } catch (error) {
        throw new NotificationError(error.message, error.status);
    }
}

const createNotificationForDeletedReservations = async (reservation, reason) => {
    try {
        if (isDefined(reservation.client)) {
            const notification = {
                client: reservation.client,
                reservation: reservation._id,
                time: getCurrentTime(),
                title: PdsConstants.RESERVATION_CANCELED_NOTIFICATION_TITLE,
                message: getStartingMessage(reservation) + fullDateToString(reservation.date) + " fue cancelada. Motivo: " + reason,
            }

            await _notificationRepository.createNotification(notification);
        }
    } catch (error) {
        throw new NotificationError(error.message, error.status);
    }
}

const getStartingMessage = (reservation) => {
    if (isDayReservation(reservation.time)) {
        return "La reserva del mediodía del ";
    }
    return "La reserva de la noche del ";
}

module.exports = {
    createNotification,
    getNotifications,
    createNotificationForBuildingClients,
    createNotificationForDeletedReservations,
};