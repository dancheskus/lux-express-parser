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
const maxPricePerTrip = 5;
const isReturning = false;

/////////////////// Парсинг HTML страницы //////////////////////////
const dataFromPageCollection = async (date, dep, des) => {
  const { data: html } = await axios.get(`${base_url}/poezdku-raspisanija/${dep}/${des}?Date=${date}`);
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
    const { totalChanges, date, TripId, DepartureRouteStopId, DestinationRouteStopId } = query[i];
    allTrips.push({ ...el, totalChanges, date, TripId, DepartureRouteStopId, DestinationRouteStopId });
  });
};

const dates = [];
for (let m = start_date; m.diff(end_date) <= 0; m.add(1, 'd')) dates.push(m.format('MM-DD-YYYY'));
const searchTickets = (dep, des) => {
  return Promise.map(dates, date => dataFromPageCollection(date, dep, des), { concurrency })
    .then(() => {
      const allQueries = [];
      addingToQueryArray(allQueries);
      return Promise.map(allQueries, query => priceCalculation(query), { concurrency })
        .then(() => {
          let selectedRoutes = [];
          allTrips.forEach(
            (
              { IsSpecialPrice, Price, date, totalChanges, TripId, DepartureRouteStopId, DestinationRouteStopId },
              i
            ) => {
              let totalPrice = Price;
              if (totalChanges > 0 && i < allTrips.length - 1) {
                totalPrice = 0;
                for (let counter = 0; counter < totalChanges + 1; counter++) {
                  totalPrice += allTrips[i + counter].Price;
                }
                for (let counter = 1; counter < totalChanges + 1; counter++) {
                  allTrips[i + counter].Price = totalPrice;
                }
              }
              IsSpecialPrice && totalPrice <= maxPricePerTrip
                ? selectedRoutes.push({ date, totalPrice, TripId, DepartureRouteStopId, DestinationRouteStopId })
                : null;
            }
          );
          selectedRoutes.sort((a, b) => moment(a.date, 'MM-DD-YYYY').diff(moment(b.date, 'MM-DD-YYYY')));
          return selectedRoutes;
        })
        .catch(e => console.log('Проблемы во втором промисе------------------------------', e));
    })
    .catch(e => console.log('Проблемы в первом промисе------------------------------', e));
};
const startApp = async () => {
  const aToB = await searchTickets(departure, destination);
  console.log(aToB);
  if (!isReturning) return;
  routesFromAllPages.length = 0;
  allTrips.length = 0;
  const bToA = await searchTickets(destination, departure);
  console.log(bToA);
};
startApp();

// Научится определять максимальное кол-во legs и concurrency, и умно их выставлять
// https://ticket.luxexpress.eu/ru/Stops/FindBy?stopName=riga - Запрос остановки --> slug - элементы ссылки
