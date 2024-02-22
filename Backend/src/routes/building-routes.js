const express = require('express');
const router = express.Router();
const multer = require('multer');

const PdsConstants = require('../utils/constants');
const buildingController = require('../controllers/building-controller');
const authentication = require('../middleware/authentication');
const imageUpload = require('../middleware/uploads');

router.post('/', authentication([PdsConstants.ADMIN_ROLE]),
    (req, res, next) => {
        imageUpload.fields([
            { name: 'image', maxCount: 1 },
            { name: 'documentation', maxCount: 1 }
        ])(req, res, function (err) {
            if (err) {
                if (err instanceof multer.MulterError) {
                    res.status(400).json("Los campos no son válidos. Si todos los campos son correctos, por favor revisa el tamaño del archivo.");
                } else {
                    res.status(err.status).json(err.message);
                }
            } else {
                next();
            }
        });
    },
    buildingController.createBuilding);

router.post('/invitations', authentication([PdsConstants.ADMIN_ROLE]), buildingController.createInvitations);

router.post('/:id/disable', authentication([PdsConstants.ADMIN_ROLE]), buildingController.disableDates);

router.get('/player', authentication([PdsConstants.CLIENT_ROLE]), buildingController.getBuildingByPlayerId);
router.get('/', authentication([PdsConstants.ADMIN_ROLE]), buildingController.getBuildings);

module.exports = router;
