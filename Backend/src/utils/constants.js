class PdsConstants {
    static CLIENT_ROLE = 'client';
    static ADMIN_ROLE = 'admin';

    static DAY = "Day";
    static NIGHT = "Night";

    static ONE_DAY_IN_MILLISECONDS = 86400000;
    static THREE_HOURS_IN_MILLISECONDS = 10800000;
    static TWELVE_HOURS_IN_MILLISECONDS = 46800000;
    static TWENTY_HOURS_IN_MILLISECONDS = 72000000;

    static ONE_DAY_LEFT_RESERVATION_NOTIFICATION_TITLE = "¡No olvides tu reserva!";
    static ONE_DAY_LEFT_RESERVATION_NOTIFICATION_MESSAGE = "Mañana a esta hora, la barbacoa te espera.";

    static BUILDING_DISABLED_NOTIFICATION_TITLE = "Barbacoa deshabilitada.";

    static RESERVATION_CANCELED_NOTIFICATION_TITLE = "Tu reserva ha sido cancelada. ";
}

module.exports = PdsConstants;