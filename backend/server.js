/* dotENV */
require('dotenv').config();

/* Express */
const port = process.env.PORT;
const app = require('express')();
const server = app.listen(port, () => console.log(`Server is working on port ${port}`));
server.setTimeout(1200000);
const ticketRoutes = require('./routes/tickets');

/* Cors */
const cors = require('cors');
app.use(cors());

/* Lodash */
const _ = require('lodash');

/* Body parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Mongoose */
require('./DB/mongooseConfig');
const User = require('./DB/models/user');

/* Express routes */

app.use('/', ticketRoutes);
