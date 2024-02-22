const Client = require('../models/client');

const { UserError } = require("../errors/user-errors");

const getClientByEmail = async (email) => {
    try {
        const client = await Client.findOne({ email: email })

        return client;
    } catch (error) {
        throw new UserError(error.message || `Unknown error at getting admin by email.`, error.status);
    }
};

const getClientById = async (id) => {
    try {
        const client = await Client.findById(id);

        return client;
    } catch (error) {
        throw new UserError(error.message || `Unknown error at getting client by id.`, error.status);
    }
};

const createClient = async (clientData) => {
    try {
        const savedClient = await Client.create(clientData)

        return savedClient;
    } catch (error) {
        throw new UserError(error.message || `Unknown error at creating client.`, error.status);
    }
}

const updateClient = async (clientId, clientData) => {
    try {
        const client = await Client.findById(clientId);

        client.name = clientData.name;
        client.surname = clientData.surname;
        client.ci = clientData.ci;
        client.cellNumber = clientData.cellNumber;
        client.email = clientData.email;

        if (clientData.password) {
            client.password = clientData.password;
        }

        const updatedClient = await client.save();

        return updatedClient;
    } catch (error) {
        throw new UserError(error.message || `Unknown error at updating client.`, error.status);
    }
}

const getClientsByBuildingId = async (buildingId) => {
    try {
        const clients = await Client.find({ building: buildingId });

        return clients;
    } catch (error) {
        throw new UserError(error.message || `Unknown error at getting clients by building id.`, error.status);
    }
}

module.exports = {
    getClientByEmail,
    createClient,
    getClientById,
    updateClient,
    getClientsByBuildingId,
}
