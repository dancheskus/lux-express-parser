const Promise = require('bluebird');
const moment = require('moment');

const { LEGS_PER_QUERY, dates, concurrency, maxPricePerTrip } = require('./settings.js');

const { dataFromPageCollection, priceCalculation } = require('./lux-express-server');

const splitLegsInChunks = routesFromAllPages => {
  const allQueries = [];
  while (routesFromAllPages.length) allQueries.push(routesFromAllPages.splice(0, LEGS_PER_QUERY));
  return allQueries;
};

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

module.exports = searchTickets;
