const PasswordToken = require('../models/passwordToken');

const { PasswordTokenError } = require("../errors/password-token-errors");

const createPasswordToken = async (clientId, token, expirationDate) => {
    try {
        const passwordToken = new PasswordToken({
            token,
            expirationDate,
            clientId,
        });

        await passwordToken.save();

        return passwordToken;
    } catch (error) {
        throw new PasswordTokenError(error.message || `Unknown error at creating password token.`, error.status);
    }
};

const getPasswordToken = async (token) => {
    try {
        const passwordToken = await PasswordToken.findOne({ token: token })

        return passwordToken;
    } catch (error) {
        throw new PasswordTokenError(error.message || `Unknown error at getting password token.`, error.status);
    }
};

const setPasswordTokenUsed = async (passwordToken) => {
    try {
        passwordToken.used = true;

        await passwordToken.save();

        return passwordToken;
    } catch (error) {
        throw new InvitationError(error.message || 'Unknown error at setting invitation as used.', error.status);
    }
};

module.exports = {
    createPasswordToken,
    getPasswordToken,
    setPasswordTokenUsed,
}
