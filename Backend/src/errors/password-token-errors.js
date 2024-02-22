class PasswordTokenError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 500;
    }
}

class PasswordTokenNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}

module.exports = {
    PasswordTokenError,
    PasswordTokenNotFoundError,
};
