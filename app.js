const axios = require('axios');
const moment = require('moment');

const base_url = 'https://ticket.luxexpress.eu/ru';
let dates = [];

const oneDayCalculation = async date => {
  const { data: html } = await axios.get(
    `${base_url}/poezdku-raspisanija/riga-coach-station/vilnius-coach-station?Date=${date}&Currency=CURRENCY.EUR`
  );

  const allRoutes = html.match(/Trip(.*)=Regular/gi);

  const routesWithoutChange = allRoutes.map(route => route.match(/\d{2,}/gi));
  const routesWithChange = [];
  routesWithoutChange.forEach((el, i) => {
    if (el.length > 3) {
      routesWithChange.push(el);
      routesWithoutChange.splice(i, 1);
    }
  });

  routesWithChange.forEach(el => {
    for (let i = 0; i < el.length / 3; i++) {
      routesWithoutChange.push([el[i * 3], el[i * 3 + 1], el[i * 3 + 2]]);
    }
  });

  routesWithoutChange.forEach(async el => {
    const json = [
      {
        Legs: [
          {
            TripId: el[0],
            DepartureRouteStopId: el[1],
            DestinationRouteStopId: el[2],
          },
        ],
      },
    ];
    const {
      data: { Trips },
    } = await axios.post(`${base_url}/TripBonusCalculator/CalculateSpecialPrice`, json);
    if (Trips[0].IsSpecialPrice) {
      console.log(`Date: ${date}. Price: ${Trips[0].Price}. TripID: ${Trips[0].TripId}`);
    }
  });

  console.log(date);
};

const end_date = moment().add(43, 'd');
for (let m = moment().add(19, 'd'); m.isBefore(end_date); m.add(1, 'd')) {
  oneDayCalculation(m.format('MM-DD-YYYY'));
}
