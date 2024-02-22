const moment = require('moment');
const fs = require('fs');

const buildingRepository = require('../repositories/building-repository');
const reservationRepository = require("../repositories/reservation-repository");
const clientRepository = require("../repositories/client-repository");
const adminRepository = require("../repositories/admin-repository");
const _notificationService = require('../services/notification-service');

const { sendInvitationsCodesEmail } = require('../handlers/notificationHandler');

const { BuildingError, MissingFieldsError } = require("../errors/building-errors");
const { InvitationError, InvitationNotFoundError, BadRequestError } = require("../errors/invitation-errors");

const createBuilding = async (buildingData, files) => {
    try {
        validateBuildingData(buildingData, files);

        const building = await buildingRepository.getBuildingByAddress(buildingData.address);

        if (building) {
            throw new BuildingError(`El edificio ya existe`);
        }

        addFilesInfo(buildingData, files);
        const savedBuilding = await buildingRepository.createBuilding(buildingData);

        return savedBuilding;
    } catch (error) {
        deleteFiles(files);
        throw new BuildingError(error.message, error.status);
    }
}

const deleteFiles = (files) => {
    try {
        if (files.image) fs.unlinkSync(files.image[0].path);
        if (files.documentation) fs.unlinkSync(files.documentation[0].path);
    } catch (error) {
        throw new BuildingError("Error inesperado mientras se borraban archivos.");
    }
}

const validateBuildingData = ({ name, address, price, hasFirewood, fireWoodPrice }, files) => {

    if (!name || !address || !price || hasFirewood === undefined) {
        throw new MissingFieldsError();
    }

    if (!files.image || !files.documentation) {
        throw new BadRequestError("Faltan archivos. Por favor sube todos los archivos.");
    }

    if (hasFirewood && !fireWoodPrice) {
        throw new MissingFieldsError("El precio de la leña es requerido");
    } else if (!hasFirewood && fireWoodPrice) {
        throw new MissingFieldsError("El precio de la leña no es requerido");
    }
}

const addFilesInfo = (buildingData, files) => {
    try {
        buildingData.image = files.image[0].filename;
        buildingData.documentation = files.documentation[0].filename;
    } catch (error) {
        throw new Error("Error inesperado mientras se subian los archivos.");
    }
};

const createInvitations = async (req) => {
    try {
        const { apartments, buildingId } = req.body;
        validateInvitationData(apartments, buildingId);
        const building = await getBuildingById(buildingId);

        const admin = await adminRepository.getAdminById(req.user.user_id);

        const codes = await generateUniqueRandomCode(apartments.length);

        const invitations = apartments.map((apartment, index) => ({
            code: codes[index],
            apartment,
            buildingId,
        }));

        const savedInvitations = await buildingRepository.createInvitations(invitations);

        sendInvitationsCodesEmail(admin, building, savedInvitations);

        return savedInvitations;
    } catch (error) {
        throw new InvitationError(error.message, error.status)
    }
}

const validateInvitationData = (apartments, buildingId) => {
    if (!apartments || !buildingId) {
        throw new MissingFieldsError();
    }

    if (!Array.isArray(apartments)) {
        throw new InvitationError(`Los apartamentos deben ser una lista de numeros`);
    }
}


const generateUniqueRandomCode = async (quantity) => {
    const uniqueCodes = new Set();
    const codeLength = 8;

    while (uniqueCodes.size < quantity) {
        const code = Math.random().toString(36).substr(2, codeLength);
        const invitation = await buildingRepository.getInvitationByCode(code);

        if (!invitation) {
            uniqueCodes.add(code);
        }
    }

    return [...uniqueCodes];
};

const validateInvitation = async (invitationCode) => {
    try {
        const invitation = await buildingRepository.getInvitationByCode(invitationCode);

        if (!invitation) {
            throw new InvitationNotFoundError('La invitación no existe');
        }

        if (invitation.used) {
            throw new BadRequestError('El código de invitación ya fue utilizado');
        }

        return invitation;
    } catch (error) {
        throw new InvitationError(error.message, error.status);
    }
};

const setUsedInvitationByCode = async (invitationCode) => {
    try {
        const invitation = await buildingRepository.getInvitationByCode(invitationCode);

        if (!invitation) {
            throw new InvitationNotFoundError('La invitación no existe');
        }

        if (invitation.used) {
            throw new BadRequestError('El código de invitación ya fue utilizado');
        }

        const invitationUsed = await buildingRepository.setUsedInvitationByCode(invitation);
        return invitationUsed;
    } catch (error) {
        throw new InvitationError(error.message, error.status);
    }
};

const getBuildingById = async (buildingId) => {
    try {
        const building = await buildingRepository.getBuildingById(buildingId);

        if (!building) {
            throw new BuildingError(`El edificio no existe`);
        }

        return building;
    } catch (error) {
        throw new BuildingError(error.message, error.status);
    }
}

const disableDates = async (buildingId, { startDate, endDate, reason }, adminId) => {
    try {
        await getBuildingById(buildingId);

        validateDisableDatesData(startDate, endDate, reason);

        const deletedReservations = await reservationRepository.deleteReservationsByDateRange(buildingId, startDate, endDate);

        const reservations = [];
        const start = moment(startDate);
        const end = moment(endDate);
        const daysQuantity = end.diff(start, 'days') + 1;

        for (let i = 0; i < daysQuantity; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            const dayReservation = {
                date,
                time: "Day",
                building: buildingId,
                acceptedTerms: true,
                fireWood: false,
                admin: adminId,
            };

            const nightReservation = {
                date,
                time: "Night",
                building: buildingId,
                acceptedTerms: true,
                fireWood: false,
                admin: adminId,
            };

            reservations.push(dayReservation);
            reservations.push(nightReservation);
        }

        await reservationRepository.createReservations(reservations);

        deletedReservations.forEach(async (reservation) => {
            await _notificationService.createNotificationForDeletedReservations(reservation, reason);
        });

        const buildingClients = await clientRepository.getClientsByBuildingId(buildingId);

        buildingClients.forEach(async (client) => {
            await _notificationService.createNotificationForBuildingClients(client, reason, startDate, endDate);
        });

    } catch (error) {
        throw new BuildingError(error.message, error.status);
    }
}

const validateDisableDatesData = (startDate, endDate, reason) => {
    if (!startDate || !endDate || !reason) {
        throw new MissingFieldsError();
    }

    if (startDate > endDate) {
        throw new BadRequestError("La fecha de inicio debe ser menor a la fecha de fin");
    }

    if (startDate < new Date()) {
        throw new BadRequestError("La fecha de inicio debe ser mayor a la fecha actual");
    }
}

const getBuildingByPlayerId = async (req) => {
    try {
        const client = await clientRepository.getClientById(req.user.user_id);

        const building = await buildingRepository.getBuildingById(client.building);
        return building;
    } catch (error) {
        throw new BuildingError(error.message, error.status);
    }
}

const getBuildings = async (req) => {
    try {
        const buildings = await buildingRepository.getBuildings();
        return buildings;
    } catch (error) {
        throw new BuildingError(error.message, error.status);
    }
}

module.exports = {
    createBuilding,
    createInvitations,
    validateInvitation,
    setUsedInvitationByCode,
    getBuildingById,
    disableDates,
    getBuildingByPlayerId,
    getBuildings,
}
