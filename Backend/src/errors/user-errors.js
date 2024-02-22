class UserError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 500;
    }
}

class UserNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}

class BadRequestError extends Error {
    constructor(message = "Datos inválidos") {
        super(message);
        this.status = 400;
    }
}

module.exports = {
    UserError,
    UserNotFoundError,
    BadRequestError
};
