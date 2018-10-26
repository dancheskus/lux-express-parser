const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 1,
    required: true,
  },
  payedUntil: {
    type: Date,
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
