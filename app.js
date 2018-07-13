const Promise = require('bluebird');
const axios = require('axios');
const moment = require('moment');

const base_url = 'https://ticket.luxexpress.eu/ru';

const oneDayCalculation = async date => {
  const { data: html } = await axios.get(
    `${base_url}/poezdku-raspisanija/riga-coach-station/vilnius-coach-station?Date=${date}&Currency=CURRENCY.EUR`
  );

  const allRoutes = html.match(/TripId&(.*?)}/gi);
  const allNumbers = allRoutes.map(route => route.match(/\d+/gi));

  const query = [];

  allNumbers.forEach(el => {
    query.push({
      Legs: [
        {
          TripId: el[0],
          DepartureRouteStopId: el[1],
          DestinationRouteStopId: el[2],
        },
      ],
    });
  });

  const {
    data: { Trips },
  } = await axios.post(`${base_url}/TripBonusCalculator/CalculateSpecialPrice`, query);

  Trips.forEach(
    el => (el.IsSpecialPrice ? console.log(`Date: ${date}. Price: ${el.Price}. TripID: ${el.TripId}`) : null)
  );
  // if (Trips[0].IsSpecialPrice) {
  //   console.log(`Date: ${date}. Price: ${Trips[0].Price}. TripID: ${Trips[0].TripId}`);
  // }

  // console.log(Trips);
};

const start_date = moment();
const end_date = moment().add(4, 'months');
const dates = [];
for (let m = start_date; m.isBefore(end_date); m.add(1, 'd')) dates.push(m.format('MM-DD-YYYY'));

Promise.map(dates, date => oneDayCalculation(date), { concurrency: 8 });

// dates.forEach(date => oneDayCalculation(date));
// oneDayCalculation('12-13-2018');
