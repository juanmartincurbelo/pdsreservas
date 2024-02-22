const jwt = require("jsonwebtoken");

const tokenModel = require("./../models/token");
const { AuthenticationError, UnauthorizedError, ManipulatedTokenError } = require("./../errors/auth-errors.js");

const generateToken = async (tokenData) => {
    try {
        if (!tokenData.user_id || !tokenData.role) {
            throw new AuthenticationError("Datos inválidos", 400);
        }

        const token = new tokenModel.Token(tokenData.user_id, tokenData.role);
        const tokenAsJson = token.toJson();
        return jwt.sign(tokenAsJson, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new AuthenticationError(error.message, error.status);
    }
}

const verifyToken = async (token) => {
    try {
        if (!token) {
            throw new UnauthorizedError();
        }
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return { user_id: decodedToken.user_id, role: decodedToken.role };
        } catch (error) {
            throw new ManipulatedTokenError();
        }
    } catch (error) {
        throw new AuthenticationError(error.message, error.status);
    }
}

module.exports = {
    generateToken,
    verifyToken,
};
