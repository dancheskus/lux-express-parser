/* dotENV */
require('dotenv').config();

/* Express */
const port = process.env.PORT;
const app = require('express')();
const server = app.listen(port, () => console.log(`Server is working on port ${port}`));
server.setTimeout(1200000);
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');
const stripe = require('./routes/stripe');

/* Cors */
const cors = require('cors');
app.use(cors());

/* Lodash */
const _ = require('lodash');

/* Body parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));

/* Mongoose */
require('./DB/mongooseConfig');

/* Express routes */

app.use('/', ticketRoutes);
app.use('/', userRoutes);
app.use('/', stripe);

const User = require('./DB/models/user');
User.findByIdAndUpdate('5bd19b4db20d8440e0a0ef18', { payedUntil: 1540464163000 })
  .then(res => console.log(res))
  .catch(e => console.log(e));
