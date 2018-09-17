const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://dancheskus:12345@cluster0-ruylq.mongodb.net/LuxExpress',
  { useNewUrlParser: true }
);
mongoose.set('useCreateIndex', true);
