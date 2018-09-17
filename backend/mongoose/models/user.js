const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email is not valid',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = User;
