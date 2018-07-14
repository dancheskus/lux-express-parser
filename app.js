const Promise = require('bluebird');
const axios = require('axios');
const moment = require('moment');

const base_url = 'https://ticket.luxexpress.eu/ru';
const routesFromAllPages = [];
const query = [{ Legs: [] }];
const allQueries = [];

/////////////////// Запросы на сервер //////////////////////////
const concurrency = 5;
const legsPerQuery = 50;

/////////////////// Настройка дат //////////////////////////
const start_date = moment([2018, 8, 10]);
const end_date = moment([2018, 8, 14]);
// const start_date = moment();
// const end_date = moment()
//   .add(6, 'months')
//   .subtract(3, 'd');

const dataFromPageCollection = async date => {
  const { data: html } = await axios.get(
    `${base_url}/poezdku-raspisanija/riga-coach-station/vilnius-coach-station?Date=${date}&Currency=CURRENCY.EUR`
  );
  const allRoutes = html.match(/TripId&(.*?)}/g);
  allRoutes.forEach(route => {
    addingToRotesFromAllPagesArray(route.match(/\d+/g), date);
  });
};

const addingToRotesFromAllPagesArray = (route, date) => {
  routesFromAllPages.push({
    TripId: route[0],
    DepartureRouteStopId: route[1],
    DestinationRouteStopId: route[2],
    date,
  });
};

const addingToQueryArray = () => {
  for (let i = 0; i < routesFromAllPages.length / legsPerQuery; i++) {
    console.log(
      `From i * legsPerQuery ${i * legsPerQuery} to legsPerQuery * i + legsPerQuery ${legsPerQuery * i + legsPerQuery}`
    );
    allQueries.push(routesFromAllPages.slice(i * legsPerQuery, legsPerQuery * i + legsPerQuery));
  }
};

const priceCalculation = async query => {
  const {
    data: { Trips },
  } = await axios.post(`${base_url}/TripBonusCalculator/CalculateSpecialPrice`, query);

  Trips.forEach((el, i) => {
    el.IsSpecialPrice ? console.log(`Date: ${query[0].Legs[i].date}. Price: ${el.Price}. TripID: ${el.TripId}`) : null;
  });
};

const dates = [];
for (let m = start_date; m.diff(end_date, 'd') <= 0; m.add(1, 'd')) dates.push(m.format('MM-DD-YYYY'));
Promise.map(dates, date => dataFromPageCollection(date), { concurrency })
  .then(() => {
    addingToQueryArray();
    Promise.map(
      allQueries,
      el => {
        query[0].Legs = el;
        return priceCalculation([{ Legs: el }]);
      },
      { concurrency }
    ).catch(e => console.log('Проблемы во втором промисе------------------------------', e));
  })
  .catch(e => console.log('Проблемы в первом промисе------------------------------', e));

// Решить проблему с несуществующими рейсами в конкретную дату
// allQueries не глобальная переменная
//6165523
