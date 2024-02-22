const mongoose = require('mongoose');

const dateEnum = ["Day", "Night"];

const reservationSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
        enum: dateEnum
    },
    acceptedTerms: {
        type: Boolean,
        required: true,
    },
    fireWood: {
        type: Boolean,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        validate: {
            validator: function (value) {
                return value.client || value.admin;
            },
            message: 'There must be at least one client or one administrator.'
        }
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        validate: {
            validator: function (value) {
                return value.client || value.admin;
            },
            message: 'There must be at least one client or one administrator.'
        }
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
