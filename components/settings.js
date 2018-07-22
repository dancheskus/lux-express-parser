const moment = require('moment');

/////////////////// Запросы на сервер //////////////////////////
let concurrency = 5;
let LEGS_PER_QUERY = 5;

/////////////////// Настройка дат //////////////////////////
const start_date = moment().add(150, 'd');
let end_date = moment().add(150, 'd');

if (
  // Ограничиваем 6-ю месяцами
  end_date >=
  moment()
    .add(6, 'M')
    .subtract(3, 'd')
)
  end_date = moment()
    .add(6, 'M')
    .subtract(4, 'd');

/////////////////// Настройка поиска //////////////////////////
// const departure = 'kuressaare';
const departure = 'vilnius-coach-station';
const destination = 'riga-coach-station';
const maxPricePerTrip = 12;
const isReturning = false;

/////////////////// Расчет дат //////////////////////////
const dates = [];
for (let m = start_date; m.diff(end_date) <= 0; m.add(1, 'd')) dates.push(m.format('MM-DD-YYYY'));

module.exports = {
  dates,
  concurrency,
  LEGS_PER_QUERY,
  departure,
  destination,
  maxPricePerTrip,
  isReturning,
};
