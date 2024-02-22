const authService = require("../services/auth-service");

const { UnauthorizedError, ForbiddenError } = require("../errors/auth-errors");

const authentication = (roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers["access-token"];

            if (!token || token === "null") {
                throw new UnauthorizedError("No se ha enviado el token");
            }

            const userInformation = await authService.verifyToken(token);

            if (!roles.includes(userInformation.role)) {
                throw new ForbiddenError();
            }

            req.user = userInformation;

            next();
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
}

module.exports = authentication;