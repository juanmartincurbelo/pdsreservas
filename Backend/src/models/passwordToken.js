const mongoose = require('mongoose');

const passwordTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9]{40}$/.test(value);
      },
      message: 'Token must be an alphanumeric string of length 40.'
    }
  },
  used: {
    type: Boolean,
    default: false
  },
  expirationDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > Date.now();
      },
      message: 'Expiration date must be in the future.'
    }
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    index: true,
  }
});

const PasswordToken = mongoose.model('PasswordToken', passwordTokenSchema);

module.exports = PasswordToken;
