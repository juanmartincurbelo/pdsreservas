const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validateEmail, isUndefinedOrNull } = require("./../utils/validator");

const adminRepository = require('../repositories/admin-repository');
const clientRepository = require('../repositories/client-repository');
const passwordTokenRepository = require('../repositories/password-token-repository');

const authService = require('./auth-service');
const buildingService = require('./building-service');

const { UserError, BadRequestError, UserNotFoundError } = require("../errors/user-errors");
const { InvalidCredentialsError, InvalidTokenError, MissingFieldsError } = require("../errors/auth-errors");
const { PasswordTokenNotFoundError } = require("../errors/password-token-errors");
const { sendRequestPasswordEmail } = require('../handlers/notificationHandler');

const login = async ({ email, password, isAdmin }) => {
    try {
        validateLoginData(email, password, isAdmin);
        validateEmail(email);

        let user;
        let role;

        if (isAdmin) {
            const admin = await adminRepository.getAdminByEmail(email);
            user = admin;
            role = "admin";
        } else {
            const client = await clientRepository.getClientByEmail(email);
            user = client;
            role = "client";
        }

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new InvalidCredentialsError();
        }

        const tokenData = {
            user_id: user._id.toString(),
            role,
        };
        const data = await authService.generateToken(tokenData);

        return { token: data, ...tokenData };
    } catch (error) {
        throw new UserError(error.message, error.status);
    }
};

const validateLoginData = (email, password, isAdmin) => {
    if (!email || !password || isUndefinedOrNull(isAdmin)) {
        throw new MissingFieldsError();
    }
};

const logout = async (req) => {
    try {
        const token = req.headers["access-token"];

        if (!token) {
            throw new InvalidTokenError("No se ha enviado el token");
        }
    } catch (error) {
        throw new UserError(error.message, error.status);
    }
};

const registerAdmin = async (adminData) => {
    try {
        validateRegisterAdminData(adminData);
        validateEmail(adminData.email);

        const admin = await adminRepository.getAdminByEmail(adminData.email);

        if (admin) {
            throw new UserError("El Admin ya existe", 400);
        }

        const salt = await bcrypt.genSalt(10);
        adminData.password = await bcrypt.hash(adminData.password, salt);

        const newAdmin = await adminRepository.createAdmin({
            ...adminData,
        });

        return newAdmin;
    } catch (error) {
        throw new UserError(error.message, error.status);
    }
}

const validateRegisterAdminData = (adminData) => {
    if (!adminData.name || !adminData.email || !adminData.password) {
        throw new MissingFieldsError();
    }
};

const registerClient = async (clientData) => {
    try {
        validateClient(clientData);
        validateEmail(clientData.email);
        await validateRegisteredEmail(clientData.email);
        const invitation = await buildingService.validateInvitation(clientData.invitationCode);

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(clientData.password, salt);
        clientData.password = encryptedPassword;

        const savedClient = await clientRepository.createClient({ ...clientData, building: invitation.buildingId, apartment: invitation.apartment });

        await buildingService.setUsedInvitationByCode(invitation.code);

        return savedClient;
    } catch (error) {
        throw new UserError(error.message, error.status);
    }
}

const validateClient = ({ name, surname, ci, password, cellNumber, email, acceptedTerms, invitationCode }) => {
    try {
        if (!name || !surname || !ci || !password || !cellNumber || !email || isUndefinedOrNull(acceptedTerms) || !invitationCode) {
            throw new MissingFieldsError();
        }

        if (password.length < 6) {
            throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');
        }

        if (!/^(?=.*\d)(?=.*[a-zA-Z]).+$/.test(password)) {
            throw new BadRequestError('La contraseña debe contener al menos un número y una letra');
        }

        if (!acceptedTerms) {
            throw new BadRequestError("Debes aceptar los términos y condiciones");
        }

        if (invitationCode.length !== 8) {
            throw new BadRequestError('El código de invitación debe tener 8 caracteres');
        }
    } catch (error) {
        throw new UserError(error.message, error.status);
    }
};

const validateRegisteredEmail = async (email) => {
    try {
        const client = await clientRepository.getClientByEmail(email);

        if (client) {
            throw new BadRequestError('El email ya está registrado');
        }
    } catch (error) {
        throw new UserError(error.message, error.status);
    }
};

const updateClient = async (req) => {
    try {
        const clientId = req.user.user_id;
        const clientData = req.body;
        validateUpdateClientData(clientData);
        validateEmail(clientData.email);

        const client = await clientRepository.getClientById(clientId);

        if (!client) {
            throw new UserNotFoundError("Cliente no encontrado");
        }

        if (client.email !== clientData.email) {
            await validateRegisteredEmail(clientData.email);
        }

        const updatedClient = await clientRepository.updateClient(clientId, clientData);

        return updatedClient;
    } catch (error) {
        throw new UserError(error.message, error.status);
    }
}

const validateUpdateClientData = ({ name, surname, ci, cellNumber, email, password }) => {
    if (!name || !surname || !ci || !cellNumber || !email) {
        throw new MissingFieldsError();
    }

    if (password) {
        throw new BadRequestError("No puedes cambiar la contraseña desde aquí");
    }
}

const requestResetPassword = async (email) => {
    try {
        if (!email) throw new MissingFieldsError();

        validateEmail(email);

        const client = await clientRepository.getClientByEmail(email);

        if (!client) {
            throw new UserNotFoundError("Cliente no encontrado");
        }

        const { token, expirationDate } = generateResetToken();
        await passwordTokenRepository.createPasswordToken(client._id.toString(), token, expirationDate);

        await sendRequestPasswordEmail(client, token);

        return token;
    } catch (error) {
        throw new UserError(error.message, error.status);
    }
}

const resetPassword = async ({ token, password, passwordConfirmation }) => {
    try {
        if (!token || !password || !passwordConfirmation) throw new MissingFieldsError();

        if (password !== passwordConfirmation) {
            throw new BadRequestError("Las contraseñas no coinciden");
        }

        if (password.length < 6) {
            throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');
        }

        if (!/^(?=.*\d)(?=.*[a-zA-Z]).+$/.test(password)) {
            throw new BadRequestError('La contraseña debe contener al menos un número y una letra');
        }

        const passwordToken = await passwordTokenRepository.getPasswordToken(token);

        if (!passwordToken) {
            throw new PasswordTokenNotFoundError("Token inválido");
        }

        if (passwordToken.used) {
            throw new BadRequestError("El token ya fue utilizado");
        }

        const expirationDate = new Date(passwordToken.expirationDate);

        if (expirationDate < Date.now()) {
            throw new BadRequestError("El token expiró");
        }

        const client = await clientRepository.getClientById(passwordToken.clientId);

        if (!client) {
            throw new UserNotFoundError("Cliente no encontrado");
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        client.password = encryptedPassword;

        await clientRepository.updateClient(client._id.toString(), client);
        await passwordTokenRepository.setPasswordTokenUsed(passwordToken);
    } catch (error) {
        throw new UserError(error.message, error.status);
    }
}

const generateResetToken = () => {
    const token = crypto.randomBytes(20).toString('hex');
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    return { token, expirationDate };
};

const getClientById = async (clientId) => {
    try {
        const client = await clientRepository.getClientById(clientId);

        if (!client) {
            throw new UserNotFoundError("Cliente no encontrado");
        }

        return client;
    } catch (error) {
        throw new UserError(error.message, error.status);
    }
}

module.exports = {
    login,
    logout,
    registerAdmin,
    registerClient,
    updateClient,
    requestResetPassword,
    resetPassword,
    getClientById,
}
