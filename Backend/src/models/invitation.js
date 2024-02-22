const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9]{8}$/.test(value);
            },
            message: 'Code must be an alphanumeric string of length 8.'
        }
    },
    apartment: {
        type: String,
        required: true,
    },
    used: {
        type: Boolean,
        default: false
    },
    buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        index: true,
    }
},
);

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;
