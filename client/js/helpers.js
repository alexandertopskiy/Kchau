/**
 * Возвращает дату в формате 'DD.MM.YYYY HH:MM'
 */
export const getFormattedDate = () => {
    const checkTime = num => (num < 10 ? '0' + num : num);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = checkTime(currentDate.getMonth());
    const day = checkTime(currentDate.getDate());
    const hour = checkTime(currentDate.getHours());
    const minutes = checkTime(currentDate.getMinutes());

    return day + '.' + month + '.' + year + ' ' + hour + ':' + minutes;
};

/**
 * Валидация автомобильного гос.номера
 */
export const validateLicensePlate = plate => {
    const example = /^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/iu;
    return example.test(plate);
};
