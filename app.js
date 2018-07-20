const Promise = require('bluebird');
const axios = require('axios');
const moment = require('moment');

const base_url = 'https://ticket.luxexpress.eu/ru';
const routesFromAllPages = [];
const allTrips = [];

/////////////////// Запросы на сервер //////////////////////////
let concurrency = 5;
let legsPerQuery = 50;

/////////////////// Настройка дат //////////////////////////
const start_date = moment().add(150, 'd');
let end_date = moment().add(170, 'd');

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
// const departure = 'kuressaare';
const departure = 'riga-coach-station';
// const destination = 'minsk-central-coach-station';
const destination = 'vilnius-coach-station';
const maxPricePerTrip = 5;

/////////////////// Парсинг HTML страницы //////////////////////////
const dataFromPageCollection = async date => {
  const { data: html } = await axios.get(`${base_url}/poezdku-raspisanija/${departure}/${destination}?Date=${date}`);
  const allRoutes = html.match(/\[{(.*?)\]/g);
  if (!allRoutes) return;
  allRoutes.forEach(el => {
    const individualRoute = el.match(/TripId&(.*?)}/g);
    individualRoute.forEach((el, i) => {
      const [TripId, DepartureRouteStopId, DestinationRouteStopId] = el.match(/\d+/g);
      routesFromAllPages.push({
        TripId,
        DepartureRouteStopId,
        DestinationRouteStopId,
        date,
        totalChanges: individualRoute.length > 1 && i === 0 ? individualRoute.length - 1 : 0,
      });
    });
  });
};

const addingToQueryArray = allQueries => {
  const allLegs = routesFromAllPages.length;
  for (let i = 0; i < allLegs / legsPerQuery; i++) {
    allQueries.push(routesFromAllPages.slice(i * legsPerQuery, legsPerQuery * i + legsPerQuery));
  }
};

const priceCalculation = async query => {
  const {
    data: { Trips },
  } = await axios.post(`${base_url}/TripBonusCalculator/CalculateSpecialPrice`, [{ Legs: query }]);
  Trips.forEach((el, i) => {
    const { totalChanges, date } = query[i];
    allTrips.push({ ...el, totalChanges, date });
  });
};

const dates = [];
for (let m = start_date; m.diff(end_date) <= 0; m.add(1, 'd')) dates.push(m.format('MM-DD-YYYY'));
Promise.map(dates, date => dataFromPageCollection(date), { concurrency })
  .then(() => {
    const allQueries = [];
    addingToQueryArray(allQueries);
    Promise.map(allQueries, query => priceCalculation(query), { concurrency })
      .then(() => {
        let selectedRoutes = [];
        allTrips.forEach(({ IsSpecialPrice, Price, date, totalChanges }, i) => {
          let totalPrice = Price;
          if (totalChanges > 0 && i < allTrips.length - 1) {
            totalPrice = 0;
            for (let counter = 0; counter < totalChanges + 1; counter++) {
              totalPrice += allTrips[i + counter].Price;
            }
          }
          IsSpecialPrice && totalPrice <= maxPricePerTrip ? selectedRoutes.push({ date, totalPrice }) : null;
        });
        selectedRoutes.sort((a, b) => moment(a.date, 'MM-DD-YYYY').diff(moment(b.date, 'MM-DD-YYYY')));
        console.log(selectedRoutes);
      })
      .catch(e => console.log('Проблемы во втором промисе------------------------------', e));
  })
  .catch(e => console.log('Проблемы в первом промисе------------------------------', e));

// Научится определять максимальное кол-во legs и concurrency, и умно их выставлять
// https://ticket.luxexpress.eu/ru/Stops/FindBy?stopName=riga - Запрос остановки --> slug - элементы ссылки
