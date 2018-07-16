const Promise = require('bluebird');
const axios = require('axios');
const moment = require('moment');

const base_url = 'https://ticket.luxexpress.eu/ru';
const routesFromAllPages = [];
const allQueries = [];

/////////////////// Запросы на сервер //////////////////////////
const concurrency = 5;
const legsPerQuery = 50;

/////////////////// Настройка дат //////////////////////////
const start_date = moment().add(1, 'd');
let end_date = moment().add(6, 'M');

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

/////////////////// Настройка направлений //////////////////////////
const departure = 'riga-coach-station';
// const destination = 'minsk-central-coach-station';
const destination = 'vilnius-coach-station';

const dataFromPageCollection = async date => {
  const { data: html } = await axios.get(`${base_url}/poezdku-raspisanija/${departure}/${destination}?Date=${date}`);
  const allRoutes = html.match(/TripId&(.*?)}/g);
  if (!allRoutes) return;
  allRoutes.forEach(el => {
    const match = el.match(/\d+/g);
    routesFromAllPages.push({
      TripId: match[0],
      DepartureRouteStopId: match[1],
      DestinationRouteStopId: match[2],
      date,
    });
  });
};

const addingToQueryArray = () => {
  for (let i = 0; i < routesFromAllPages.length / legsPerQuery; i++) {
    allQueries.push(routesFromAllPages.slice(i * legsPerQuery, legsPerQuery * i + legsPerQuery));
  }
};

const priceCalculation = async query => {
  const {
    data: { Trips },
  } = await axios.post(`${base_url}/TripBonusCalculator/CalculateSpecialPrice`, [{ Legs: query }]);

  Trips.forEach(({ IsSpecialPrice, Price, TripId }, i) => {
    IsSpecialPrice ? console.log(`Date: ${query[i].date}. Price: ${Price}. TripID: ${TripId}`) : null;
  });
};

const dates = [];
for (let m = start_date; m.diff(end_date, 'd') <= 0; m.add(1, 'd')) dates.push(m.format('MM-DD-YYYY'));
Promise.map(dates, date => dataFromPageCollection(date), { concurrency })
  .then(() => {
    addingToQueryArray();
    Promise.map(allQueries, query => priceCalculation(query), { concurrency }).catch(e =>
      console.log('Проблемы во втором промисе------------------------------', e)
    );
  })
  .catch(e => console.log('Проблемы в первом промисе------------------------------', e));

// allQueries не глобальная переменная
// Упростить regex
// Научится определять сумму со всеми пересадками, и ограничивать по цене
// Научится определять максимальное кол-во legs и concurrency, и умно их выставлять
// https://ticket.luxexpress.eu/ru/Stops/FindBy?stopName=riga - Запрос остановки --> slug - элементы ссылки
