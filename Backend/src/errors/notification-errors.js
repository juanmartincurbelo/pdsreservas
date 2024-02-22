class NotificationError extends Error {
    constructor(message = "Error en la notificación") {
        super(message);
        this.status = 400;
    }
}

module.exports = {
    NotificationError,
};
