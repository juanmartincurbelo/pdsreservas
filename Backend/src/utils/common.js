const getCurrentDateWithZeroTime = () => {
    const currentUtcTime = getCurrentTime();
    currentUtcTime.setUTCHours(0, 0, 0, 0);

    return currentUtcTime;
};

const getCurrentDateWithZeroTimeInMs = () => {
    const dateWithZeroTime = getCurrentDateWithZeroTime();

    return dateWithZeroTime.getTime();
}

const getCurrentTime = () => {
    const currentUtcTime = new Date();
    currentUtcTime.setUTCHours(currentUtcTime.getUTCHours() - 3);

    return currentUtcTime;
}

const dateToString = (date) => {
    const dateString = date + '';
    const [anio, mes, dia] = dateString.split('-');
    return `${dia}-${mes}`;
}

const fullDateToString = (d) => {
    const date = new Date(d);
    const dia = date.getUTCDate();
    const mes = date.getUTCMonth();

    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;

    return `${diaFormateado}-${mesFormateado}`;
}

const isDayReservation = (time) => {
    return time == "Day";
}

const isNightReservation = (time) => {
    return time == "Night";
}

const isImageType = (type) => {
    return type === 'image/jpg' || type === "image/jpeg" || type === "image/png";
}

module.exports = {
    getCurrentDateWithZeroTimeInMs,
    getCurrentTime,
    getCurrentDateWithZeroTime,
    isDayReservation,
    isNightReservation,
    dateToString,
    fullDateToString,
    isImageType,
};