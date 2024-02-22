class BuildingError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 500;
    }
}

class BuildingNotFoundError extends Error {
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

class MissingFieldsError extends Error {
    constructor(message = "Faltan campos obligatorios") {
        super(message);
        this.status = 400;
    }
}

module.exports = {
    BuildingError,
    BuildingNotFoundError,
    BadRequestError,
    MissingFieldsError
};
