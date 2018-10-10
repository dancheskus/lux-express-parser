const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

mongoose.connect(
  'mongodb+srv://dancheskus:12345@cluster0-ruylq.mongodb.net/LuxExpressApp',
  { useNewUrlParser: true }
);
