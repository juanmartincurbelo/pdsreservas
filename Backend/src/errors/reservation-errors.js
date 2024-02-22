class ReservationError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 500;
    }
}

class BadRequestError extends Error {
    constructor(message = "Datos inválidos") {
        super(message);
        this.status = 400;
    }
}

module.exports = {
    ReservationError,
    BadRequestError
};
