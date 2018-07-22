const Promise = require('bluebird');
const axios = require('axios');
const moment = require('moment');

const base_url = 'https://ticket.luxexpress.eu/ru';

const {
  start_date,
  end_date,
  concurrency,
  LEGS_PER_QUERY,
  departure,
  destination,
  maxPricePerTrip,
  isReturning,
} = require('./settings.js');

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
  } = await axios.post(`${base_url}/TripBonusCalculator/CalculateSpecialPrice`, [
    {
      Legs: chunk,
    },
  ]);
  return Trips.map((trip, i) => {
    const { totalChanges, date, TripId, DepartureRouteStopId, DestinationRouteStopId } = chunk[i];
    return {
      ...trip,
      totalChanges,
      date,
      TripId,
      DepartureRouteStopId,
      DestinationRouteStopId,
    };
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
  ).catch(e => console.log('Проблемы в первом промисе------------------------------', e));
  const allTrips = [];
  await Promise.map(
    splitLegsInChunks(routesFromAllPages),
    async chunk => allTrips.push(...(await priceCalculation(chunk))),
    {
      concurrency,
    }
  ).catch(e => console.log('Проблемы во втором промисе------------------------------', e));
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
      selectedRoutes.push({
        date,
        totalPrice,
        TripId,
        DepartureRouteStopId,
        DestinationRouteStopId,
      });
    }
  );
  selectedRoutes.sort((a, b) => moment(a.date, 'MM-DD-YYYY').diff(moment(b.date, 'MM-DD-YYYY')));
  return selectedRoutes;
};
const startApp = async () => {
  const aToB = await searchTickets(departure, destination);
  console.log(aToB);
  if (!isReturning) return;
  const bToA = await searchTickets(destination, departure);
  console.log(bToA);
};
startApp();

// Научится определять максимальное кол-во legs и concurrency, и умно их выставлять
// https://ticket.luxexpress.eu/ru/Stops/FindBy?stopName=riga - Запрос остановки --> slug - элементы ссылки
