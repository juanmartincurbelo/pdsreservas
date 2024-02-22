const Building = require('../models/building');
const Invitation = require('../models/invitation');

const { BuildingError, BuildingNotFoundError } = require('../errors/building-errors');
const { InvitationError } = require('../errors/invitation-errors');

const createBuilding = async (buildingData) => {
    try {
        const savedBuilding = await Building.create(buildingData);

        return savedBuilding;
    } catch (error) {
        throw new BuildingError(error.message || `Unknown error at creating building.`, error.status);
    }
}

const getBuildingByAddress = async (address) => {
    try {
        const building = await Building.findOne({ address });

        return building;
    } catch (error) {
        throw new BuildingError(error.message || `Unknown error at getting building by name.`, error.status);
    }
}

const getBuildingById = async (id) => {
    try {
        const building = await Building.findById(id);

        return building;
    } catch (error) {
        throw new BuildingError(error.message || `Unknown error at getting building by id.`, error.status);
    }
}

const createInvitations = async (invitations) => {
    try {
        const savedInvitations = [];

        for (const invitation of invitations) {
            const newInvitation = new Invitation({
                code: invitation.code,
                apartment: invitation.apartment,
                buildingId: invitation.buildingId,
            });

            await newInvitation.save();
            savedInvitations.push(newInvitation);
        }

        return savedInvitations;
    } catch (error) {
        throw new InvitationError(error.message || 'Unknown error at creating invitations.', error.status);
    }
};

const getInvitationByCode = async (invitationCode) => {
    try {
        const invitation = await Invitation.findOne({ code: invitationCode });

        return invitation;
    } catch (error) {
        throw new InvitationError(error.message || 'Unknown error at getting invitation by code.', error.status);
    }
};

const setUsedInvitationByCode = async (invitation) => {
    try {
        invitation.used = true;

        await invitation.save();

        return invitation;
    } catch (error) {
        throw new InvitationError(error.message || 'Unknown error at setting invitation as used.', error.status);
    }
};

const getBuildings = async () => {
    try {
        const buildings = await Building.find();

        return buildings;
    } catch (error) {
        throw new BuildingError(error.message || 'Unknown error at getting buildings.', error.status);
    }
};

module.exports = {
    createBuilding,
    getBuildingByAddress,
    getBuildingById,
    createInvitations,
    getInvitationByCode,
    setUsedInvitationByCode,
    getBuildings,
}
