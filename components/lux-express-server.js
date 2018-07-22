const axios = require('axios');

const base_url = 'https://ticket.luxexpress.eu/ru';

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

module.exports = { dataFromPageCollection, priceCalculation };
