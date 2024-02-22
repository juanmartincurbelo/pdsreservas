class InvitationError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || 500;
  }
}

class InvitationNotFoundError extends Error {
  constructor(message = "Invitación no encontrada") {
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
  InvitationError,
  InvitationNotFoundError,
  BadRequestError,
};
