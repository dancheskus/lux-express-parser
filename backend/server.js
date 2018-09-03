const moment = require('moment');
const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 3000;

const { creatingDatesArray } = require('./components/settings.js');

const startApp = require('./app');

app.get('/', (req, res) => {
  res.json({ response: 'Hello World' });
});

app.post(
  '/findtickets',
  async (
    { body: { departure, destination, maxPricePerTrip, isReturning, start_date, end_date, returningDayRange } },
    res
  ) => {
    // console.log(departure, destination, maxPricePerTrip, isReturning, start_date, end_date, returningDayRange);
    const dates = creatingDatesArray(start_date, end_date);
    const result = await startApp(departure, destination, dates, isReturning, returningDayRange, maxPricePerTrip);
    // console.log('result:', result);
    res.json({ response: result });
  }
);

const server = app.listen(port, () => console.log(`Server is working on port ${port}`));

server.setTimeout(1200000);
