const validator = require("validator");

const { InvalidEmailError } = require("./../errors/auth-errors");

const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
        throw new InvalidEmailError();
    }
};

const isUndefinedOrNull = (value) => {
    return value === undefined || value === null;
};

const isDefined = (value) => {
    return !isUndefinedOrNull(value);
}

module.exports = {
    validateEmail,
    isUndefinedOrNull,
    isDefined,
};