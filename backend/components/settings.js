const moment = require('moment');

/////////////////// Запросы на сервер //////////////////////////
let concurrency = 3;
let LEGS_PER_QUERY = 50;

const creatingDatesArray = (startDate, endDate) => {
  /////////////////// Настройка дат //////////////////////////
  const start_date = moment(startDate, 'DD.MM.YYYY');
  let end_date = moment(endDate, 'DD.MM.YYYY');

  if (
    // Ограничиваем 6-ю месяцами
    end_date >= moment().add(6, 'M')
    // .subtract(3, 'd')
  )
    end_date = moment().add(6, 'M');
  // .subtract(4, 'd');

  /////////////////// Расчет дат //////////////////////////
  const dates = [];
  for (let m = start_date; m.diff(end_date) <= 0; m.add(1, 'd')) dates.push(m.format('MM-DD-YYYY'));
  return dates;
};

module.exports = {
  creatingDatesArray,
  concurrency,
  LEGS_PER_QUERY,
};
