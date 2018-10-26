const User = require('../DB/models/user');
const jwt = require('jsonwebtoken');

const isVerified = async (req, res, next) => {
  try {
    req.user = await User.findOne({ _id: jwt.verify(req.headers['x-auth'], process.env.SECRET_KEY).id });
    next();
  } catch (error) {
    res.status(400).json({ message: 'Please log in' });
  }
};

module.exports = isVerified;
