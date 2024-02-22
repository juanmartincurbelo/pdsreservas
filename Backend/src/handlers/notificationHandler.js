const sendGrid = require('@sendgrid/mail');
sendGrid.setApiKey(process.env.API_SENDGRID);

const _notificationService = require('../services/notification-service');
const _reservationService = require('../services/reservation-service');

const { getCurrentDateWithZeroTime } = require('../utils/common');
const { isDefined } = require('../utils/validator');

const sendNotifications = async (reservationTime) => {
    const tomorrow = getCurrentDateWithZeroTime();
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
        const reservation = await _reservationService.getReservationByDateAndTime(tomorrow, reservationTime);

        if (isDefined(reservation)) {
            await _notificationService.createNotification(reservation);
        };
    } catch (error) { }
}

const sendRequestPasswordEmail = async (client, token) => {
    const emailText = '<div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">' +
        '<h1 style="color: #333333;">Restablecer Contraseña en Pds Reservas</h1>' +
        '<p>Hola <strong style="color: #007BFF;">' + client.name + '</strong>,</p>' +
        '<p>Se solicitó un restablecimiento de contraseña para su cuenta.</p>' +
        '<p>Con el siguiente token podrá restablecer su contraseña: <strong>' + token + '</strong></p></div>';

    const email = {
        to: client.email,
        from: 'juancurbelo02@gmail.com',
        subject: 'Restablecer Contraseña en Pds Reservas',
        html: emailText
    };

    await sendGrid.send(email);
};


const sendInvitationsCodesEmail = async (admin, building, invitations) => {
    let emailText = '<div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">' +
        '<h1 style="color: #333333;">Códigos de Invitación en Pds Reservas</h1>' +
        '<p>Hola <strong>' + admin.name + '</strong>,</p>' +
        '<p>Aquí están los códigos de invitación solicitados para el edificio <strong style="color: #007BFF;">' + building.name + '</strong>:</p>' +
        '<ul>';

    invitations.forEach((invitation) => {
        emailText += '<li style="color: #333333;">Apartamento ' + invitation.apartment + ': <strong>' + invitation.code + '</strong></li>';
    });

    emailText += '</ul></div>';

    const email = {
        to: admin.email,
        from: 'juancurbelo02@gmail.com',
        subject: 'Códigos de invitación en Pds Reservas',
        html: emailText
    };

    await sendGrid.send(email);
};


module.exports = {
    sendNotifications,
    sendRequestPasswordEmail,
    sendInvitationsCodesEmail,
};