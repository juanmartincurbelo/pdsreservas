const express = require('express');
const router = express.Router();

const PdsConstants = require('../utils/constants');

const userController = require('../controllers/user-controller');

const authentication = require('../middleware/authentication');

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/password', userController.requestResetPassword);
router.put('/password', userController.resetPassword);

router.post('/admins/register', authentication([PdsConstants.ADMIN_ROLE]), userController.registerAdmin);
router.post('/clients/register', userController.registerClient);

router.put('/clients', authentication([PdsConstants.CLIENT_ROLE]), userController.updateClient);
router.get('/clients/profile', authentication([PdsConstants.CLIENT_ROLE]), userController.getClientProfile);

router.get('/clients/:id', authentication([PdsConstants.ADMIN_ROLE]), userController.getClientById);

module.exports = router;
