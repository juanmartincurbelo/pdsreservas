const { NotificationError } = require("../errors/notification-errors");
const Notification = require("../models/notification");

const createNotification = async (notification) => {
    try {
        await Notification.create(notification);
    } catch (error) {
        throw new NotificationError(error.message || `Unknown error at creating notification.`, error.status);
    }
}

const getNotifications = async (clientId) => {
    try {
        const notifications = await Notification.find({ client: clientId });

        return notifications;
    } catch (error) {
        throw new NotificationError(error.message || `Unknown error at getting notifications.`, error.status);
    }
}

module.exports = {
    createNotification,
    getNotifications,
};