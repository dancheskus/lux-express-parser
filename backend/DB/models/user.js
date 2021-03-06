const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  surname: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    validate: {
      validator: name =>
        name.match(
          /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        ),
      message: 'emailValidationError',
    },
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  payedUntil: {
    type: Number,
    default: null,
  },
});

UserSchema.pre('save', function() {
  this.email = this.email.toLowerCase();
  this.password = bcrypt.hashSync(this.password, 10);
});

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
