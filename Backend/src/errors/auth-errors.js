class AuthenticationError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 500;
    }
}

class ForbiddenError extends Error {
    constructor(message = "No tienes permiso para realizar esta acción") {
        super(message);
        this.status = 403;
    }
}

class UnauthorizedError extends Error {
    constructor(message = "Token inválido") {
        super(message);
        this.status = 401;
    }
}

class ManipulatedTokenError extends Error {
    constructor(message = "Token manipulado") {
        super(message);
        this.status = 401;
    }
}

class InvalidCredentialsError extends Error {
    constructor(message = "Mail o contraseña incorrectos") {
        super(message);
        this.status = 401;
    }
}

class InvalidTokenError extends Error {
    constructor(message = "Token inválido") {
        super(message);
        this.status = 401;
    }
}

class MissingFieldsError extends Error {
    constructor(message = "Faltan campos obligatorios") {
        super(message);
        this.status = 400;
    }
}

class InvalidEmailError extends Error {
    constructor(message = "Mail inválido") {
        super(message);
        this.status = 400;
    }

}


module.exports = {
    AuthenticationError,
    UnauthorizedError,
    ForbiddenError,
    ManipulatedTokenError,
    InvalidCredentialsError,
    InvalidTokenError,
    MissingFieldsError,
    InvalidEmailError,
};