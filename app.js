const Promise = require('bluebird');
const axios = require('axios');
const moment = require('moment');

const base_url = 'https://ticket.luxexpress.eu/ru';
const allTrips = [];

/////////////////// Запросы на сервер //////////////////////////
let concurrency = 5;
let LEGS_PER_QUERY = 50;

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

/////////////////// Парсинг HTML страницы //////////////////////////
const dataFromPageCollection = async (date, dep, des) => {
  const routesFromCurrentPage = [];
  const { data: html } = await axios.get(`${base_url}/poezdku-raspisanija/${dep}/${des}?Date=${date}`);
  const allRoutes = html.match(/\[{(.*?)\]/g);
  if (!allRoutes) return [];
  allRoutes.forEach(el => {
    const individualRoute = el.match(/TripId&(.*?)}/g);
    individualRoute.forEach((el, i) => {
      const [TripId, DepartureRouteStopId, DestinationRouteStopId] = el.match(/\d+/g);
      routesFromCurrentPage.push({
        TripId,
        DepartureRouteStopId,
        DestinationRouteStopId,
        date,
        totalChanges: individualRoute.length > 1 && i === 0 ? individualRoute.length - 1 : 0,
      });
    });
  });
  return routesFromCurrentPage;
};

const splitLegsInChunks = routesFromAllPages => {
  const allQueries = [];
  while (routesFromAllPages.length) allQueries.push(routesFromAllPages.splice(0, LEGS_PER_QUERY));
  return allQueries;
};

const priceCalculation = async chunk => {
  const {
    data: { Trips },
  } = await axios.post(`${base_url}/TripBonusCalculator/CalculateSpecialPrice`, [{ Legs: chunk }]);
  Trips.forEach((el, i) => {
    const { totalChanges, date, TripId, DepartureRouteStopId, DestinationRouteStopId } = chunk[i];
    allTrips.push({ ...el, totalChanges, date, TripId, DepartureRouteStopId, DestinationRouteStopId });
  });
};

const dates = [];
for (let m = start_date; m.diff(end_date) <= 0; m.add(1, 'd')) dates.push(m.format('MM-DD-YYYY'));
const searchTickets = async (dep, des) => {
  const routesFromAllPages = [];
  await Promise.map(
    dates,
    async date => {
      routesFromAllPages.push(...(await dataFromPageCollection(date, dep, des)));
    },
    {
      concurrency,
    }
  ).catch(e => console.log('Проблемы в первом промисе------------------------------')); //, e));

  await Promise.map(splitLegsInChunks(routesFromAllPages), chunk => priceCalculation(chunk), { concurrency }).catch(
    e => console.log('Проблемы во втором промисе------------------------------') //, e)
  );
  let selectedRoutes = [];
  allTrips.forEach(
    ({ IsSpecialPrice, Price, date, totalChanges, TripId, DepartureRouteStopId, DestinationRouteStopId }, i) => {
      let totalPrice = Price;
      if (totalChanges > 0 && i < allTrips.length - 1) {
        for (let change = 1; change <= totalChanges; change++) {
          totalPrice += allTrips[i + change].Price;
        }
        for (let change = 1; change <= totalChanges; change++) {
          allTrips[i + change].Price = totalPrice;
        }
      }
      if (!IsSpecialPrice || totalPrice > maxPricePerTrip) return;
      selectedRoutes.push({ date, totalPrice, TripId, DepartureRouteStopId, DestinationRouteStopId });
    }
  );
  selectedRoutes.sort((a, b) => moment(a.date, 'MM-DD-YYYY').diff(moment(b.date, 'MM-DD-YYYY')));
  return selectedRoutes;
};
const startApp = async () => {
  const aToB = await searchTickets(departure, destination);
  console.log(aToB);
  if (!isReturning) return;
  allTrips.length = 0;
  const bToA = await searchTickets(destination, departure);
  console.log(bToA);
};
startApp();

// Научится определять максимальное кол-во legs и concurrency, и умно их выставлять
// https://ticket.luxexpress.eu/ru/Stops/FindBy?stopName=riga - Запрос остановки --> slug - элементы ссылки
