const userService = require('../services/user-service');

const registerAdmin = async (req, res) => {
    try {
        const admin = await userService.registerAdmin(req.body);
        res.status(200).json({ success: true, data: admin });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const registerClient = async (req, res) => {
    try {
        const client = await userService.registerClient(req.body);
        res.status(200).json({ success: true, data: client });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const updateClient = async (req, res) => {
    try {
        const client = await userService.updateClient(req);
        res.status(200).json({ success: true, data: client });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const token = await userService.login(req.body);
        res.status(200).header("access-token", token.token).json({ success: true, role: token.role, message: 'Logged in' });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        await userService.logout(req);
        delete req.headers['access-token'];
        res.status(200).json({ success: true, message: 'Logged out' });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

const requestResetPassword = async (req, res) => {
    try {
        const resetToken = await userService.requestResetPassword(req.body.email);
        res.status(200).json({ success: true, data: resetToken });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        await userService.resetPassword(req.body);
        res.status(200).json({ success: true, message: 'Password successfully reset' });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const getClientProfile = async (req, res) => {
    try {
        const client = await userService.getClientById(req.user.user_id);
        res.status(200).json({ success: true, data: client });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

const getClientById = async (req, res) => {
    try {
        const client = await userService.getClientById(req.params.id);
        res.status(200).json({ success: true, data: client });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
}

module.exports = {
    registerAdmin,
    registerClient,
    updateClient,
    login,
    logout,
    requestResetPassword,
    resetPassword,
    getClientProfile,
    getClientById,
};
