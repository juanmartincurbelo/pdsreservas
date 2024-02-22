const _notificationService = require('../services/notification-service');

const getNotifications = async (req, res) => {
    try {
        const clientId = req.user.user_id;

        const notifications = await _notificationService.getNotifications(clientId);
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });

    }
}

module.exports = {
    getNotifications,
}
