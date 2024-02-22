const mongoose = require('mongoose');
const { getCurrentTime } = require('../utils/common');

const notificationSchema = new mongoose.Schema({
    time: {
        type: Date,
        default: getCurrentTime(),
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        default: null,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
