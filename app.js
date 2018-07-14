const Promise = require('bluebird');
const axios = require('axios');
const moment = require('moment');

const base_url = 'https://ticket.luxexpress.eu/ru';
const routesFromAllPages = [];
const query = [{ Legs: [] }];
const allQueries = [];

/////////////////// Запросы на сервер //////////////////////////
const concurrency = 8;
const legsPerQuery = 130;

const dataFromPageCollection = async date => {
  const { data: html } = await axios.get(
    `${base_url}/poezdku-raspisanija/riga-coach-station/vilnius-coach-station?Date=${date}&Currency=CURRENCY.EUR`
  );
  const allRoutes = html.match(/TripId&(.*?)}/g);
  allRoutes.forEach((route, i) => {
    addingToRotesFromAllPagesArray(route.match(/\d+/g));
  });
};

const addingToRotesFromAllPagesArray = route => {
  routesFromAllPages.push({
    TripId: route[0],
    DepartureRouteStopId: route[1],
    DestinationRouteStopId: route[2],
  });
};

const addingToQueryArray = async () => {
  for (let i = 0; i < routesFromAllPages.length / legsPerQuery; i++) {
    allQueries.push(routesFromAllPages.slice(i * legsPerQuery, legsPerQuery * i + legsPerQuery));
    // query[0].Legs = routesFromAllPages.slice(i * legsPerQuery, legsPerQuery * i + legsPerQuery);
    // await priceCalculation(query);
    // console.log(3);
  }
};

const priceCalculation = async query => {
  const {
    data: { Trips },
  } = await axios.post(`${base_url}/TripBonusCalculator/CalculateSpecialPrice`, query);

  Trips.forEach(
    el => (el.IsSpecialPrice ? console.log(`Date: {date}. Price: ${el.Price}. TripID: ${el.TripId}`) : null)
  );
};

const start_date = moment().add(3, 'months');
const end_date = moment().add(4, 'months');
const dates = [];
for (let m = start_date; m.diff(end_date, 'd') <= 0; m.add(1, 'd')) dates.push(m.format('MM-DD-YYYY'));

Promise.map(dates, date => dataFromPageCollection(date), { concurrency }).then(() => {
  // priceCalculation(query);
  // console.log(JSON.stringify(query));
  addingToQueryArray();
  Promise.map(
    allQueries,
    el => {
      query[0].Legs = el;
      return priceCalculation(query);
    },
    { concurrency }
  );

  // console.log(routesFromAllPages);
  // console.log(JSON.stringify(query));
  // console.log(query[0].Legs.length);
});

// Решить проблему с несуществующими рейсами в конкретную дату
