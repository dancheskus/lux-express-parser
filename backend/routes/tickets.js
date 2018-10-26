const axios = require('axios');
const router = require('express').Router();
const { creatingDatesArray } = require('../components/settings.js');
const startApp = require('../app');
const isVerified = require('../helpers/userVerification');
const moment = require('moment');

router.get('/getstops', async (_, res) => {
  try {
    res.send((await axios.get('https://ticket.luxexpress.eu/ru/Stops/FindBy')).data);
  } catch (error) {
    res.status(400).json({ message: 'Lux express сервер не доступен' });
  }
});

router.post(
  '/findtickets',
  isVerified,
  async (
    { user, body: { departure, destination, maxPricePerTrip, isReturning, start_date, end_date, returningDayRange } },
    res
  ) => {
    if (user.payedUntil <= Date.now()) {
      const startDate = moment(start_date, 'DD.MM.YYYY');
      const endDate = moment(end_date, 'DD.MM.YYYY');
      if (isReturning !== false || endDate.diff(startDate, 'd') > 7)
        return res.status(400).json({ message: 'something went wrong' });
    }
    const dates = creatingDatesArray(start_date, end_date);
    const result = await startApp(departure, destination, dates, isReturning, returningDayRange, maxPricePerTrip);
    res.json({ response: result });
  }
);

module.exports = router;
