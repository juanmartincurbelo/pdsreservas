const express = require('express');
const router = express.Router();

const PdsConstants = require('../utils/constants');
const _notificationController = require('../controllers/notification-controller');
const authentication = require('../middleware/authentication');

router.get('/', authentication([PdsConstants.CLIENT_ROLE, PdsConstants.ADMIN_ROLE]), _notificationController.getNotifications);

module.exports = router;