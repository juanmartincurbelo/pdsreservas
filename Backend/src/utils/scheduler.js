const cron = require('node-cron');

const notificationHandler = require('../handlers/notificationHandler');
const PdsConstants = require('./constants');

const reservationNotificationScheduler = () => {
    // Schedule for 12:00 p.m.
    cron.schedule('0 12 * * *', () => {
        notificationHandler.sendNotifications(PdsConstants.DAY);
    });

    // Schedule for 8:00 p.m.
    cron.schedule('0 20 * * *', () => {
        notificationHandler.sendNotifications(PdsConstants.NIGHT);
    });
}

module.exports = { reservationNotificationScheduler };

