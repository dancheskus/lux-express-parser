/* Express */
const port = 5000;
const app = require('express')();
const server = app.listen(port, () => console.log(`Server is working on port ${port}`));
server.setTimeout(1200000);

/* Cors */
const cors = require('cors');
app.use(cors());

/* Body parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Mongoose */
require('./mongoose/mongooseConfig');
const { ObjectID } = require('mongodb');
const User = require('./mongoose/models/user');

const { creatingDatesArray } = require('./components/settings.js');
const startApp = require('./app');

/* Express routes */

app.get('/', (req, res) => {
  res.json({ response: 'Hello World' });
});

app.post(
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

app.post('/users', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  user
    .save()
    .then(savedUser =>
      res.json({
        message: 'User saved',
        content: savedUser,
      })
    )
    .catch(e => res.status(400).json(e));
});

app.get('/users', (req, res) => {
  User.find()
    .then(allUsers => res.json(allUsers))
    .catch(e => res.status(400).json(e));
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) return res.status(404).json({ message: 'ID is not valid' });

  User.findById(id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'User with this ID was not found' });

      res.json(user);
    })
    .catch(e => res.status(400).json(e));
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) return res.status(404).json({ message: 'ID is not valid' });

  User.findByIdAndRemove(id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'User with this ID was not found' });

      res.json(user);
    })
    .catch(e => res.status(400).json(e));
});
