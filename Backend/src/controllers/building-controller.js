const buildingService = require('../services/building-service');

const createBuilding = async (req, res) => {
    try {
        const buildingData = JSON.parse(req.body.jsonData);
        const files = req.files;
        const building = await buildingService.createBuilding(buildingData, files);
        res.status(200).json({ success: true, data: building });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const createInvitations = async (req, res) => {
    try {
        const invitations = await buildingService.createInvitations(req);
        res.status(200).json({ success: true, data: invitations });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const disableDates = async (req, res) => {
    try {
        const building = await buildingService.disableDates(req.params.id, req.body, req.user.user_id);
        res.status(200).json({ success: true, data: building });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const getBuildingByPlayerId = async (req, res) => {
    try {
        const building = await buildingService.getBuildingByPlayerId(req);
        res.status(200).json({ success: true, data: building });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const getBuildings = async (req, res) => {
    try {
        const buildings = await buildingService.getBuildings(req);
        res.status(200).json({ success: true, data: buildings });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

module.exports = {
    createBuilding,
    createInvitations,
    disableDates,
    getBuildingByPlayerId,
    getBuildings,
}
