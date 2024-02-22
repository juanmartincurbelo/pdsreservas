const { UserError } = require("../errors/user-errors");
const Admin = require("../models/admin");

const getAdminByEmail = async (email) => {
    try {
        const admin = await Admin.findOne({ email: email })

        return admin;
    } catch (error) {
        throw new UserError(error.message || `Unknown error at getting admin by email.`, error.status);
    }
};

const createAdmin = async (adminData) => {
    try {
        const admin = await Admin.create(adminData);

        return admin;
    } catch (error) {
        throw new UserError(error.message || `Unknown error at creating admin.`, error.status);
    }
}

const getAdminById = async (id) => {
    try {
        const admin = await Admin.findById(id);

        return admin;
    } catch (error) {
        throw new UserError(error.message || `Unknown error at getting admin by id.`, error.status);
    }
}

module.exports = {
    getAdminByEmail,
    createAdmin,
    getAdminById,
}