const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true
    },
    ci: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cellNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    building: {
        type: Schema.Types.ObjectId,
        ref: 'Building'
    },
    apartment: {
        type: String,
        required: true
    },
    acceptedTerms: {
        type: Boolean,
        required: true,
    },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
