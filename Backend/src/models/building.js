const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
  },
  hasFirewood: {
    type: Boolean,
    required: true
  },
  fireWoodPrice: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  documentation: {
    type: String,
    required: true
  },
});

const Building = mongoose.model('Building', buildingSchema);

module.exports = Building;