const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

mongoose.connect(
  process.env.DB,
  { useNewUrlParser: true }
);
