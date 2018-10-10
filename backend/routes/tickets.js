const axios = require('axios');
const router = require('express').Router();
const { creatingDatesArray } = require('../components/settings.js');
const startApp = require('../app');

router.get('/findstops', async (_, res) => {
  res.send((await axios.get('https://ticket.luxexpress.eu/ru/Stops/FindBy')).data);
});

router.post(
  '/findtickets',
  async (
    { body: { departure, destination, maxPricePerTrip, isReturning, start_date, end_date, returningDayRange } },
    res
  ) => {
    const dates = creatingDatesArray(start_date, end_date);
    const result = await startApp(departure, destination, dates, isReturning, returningDayRange, maxPricePerTrip);
    res.json({ response: result });
  }
);

module.exports = router;
