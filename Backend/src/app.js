require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const mongodb = require("./db/mongoose");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const Admin = require("./models/admin");

const userRoutes = require("./routes/user-routes");
const buildingRoutes = require("./routes/building-routes");
const reservationRoutes = require("./routes/reservation-routes");
const notificationRoutes = require("./routes/notification-routes");
const scheduler = require("./utils/scheduler");

const createSuperadmin = async () => {
  try {
    const superadmin = new Admin({
      name: 'Superadmin',
      email: 'admin@ort.com',
      password: 'Password1',
    });

    const emailExists = await Admin.findOne({ email: superadmin.email });

    if (!emailExists) {
      const salt = await bcrypt.genSalt(10);
      superadmin.password = await bcrypt.hash(superadmin.password, salt);

      await Admin.create(superadmin);

      console.log('Superadmin created.');
    }
  } catch (err) {
    console.error('Error creating superadmin:', err);
  }
}

createSuperadmin();

const initApp = async (expressApp) => {
  await mongodb.initDatabase(mongoose);

  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, access-token, Authorization',
    exposedHeaders: 'access-token',
  };

  expressApp.use(express.json());
  expressApp.use(cookieParser());
  expressApp.use(cors(corsOptions));
  expressApp.use("/api/users", userRoutes);
  expressApp.use("/api/buildings", buildingRoutes);
  expressApp.use("/api/reservations", reservationRoutes);
  expressApp.use("/api/notifications", notificationRoutes);

  scheduler.reservationNotificationScheduler();
}

module.exports = {
  initApp,
};
