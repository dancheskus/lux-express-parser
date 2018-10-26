const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(
  process.env.DB,
  { useNewUrlParser: true }
);
