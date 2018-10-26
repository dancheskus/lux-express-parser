const User = require('../DB/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = require('express').Router();
const isVerified = require('../helpers/userVerification');

router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ message: user.username + ' is registered successfully', user });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!bcrypt.compareSync(req.body.password, user.password))
      return res.status(400).json({ message: 'Not authorized' });
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY); //, { expiresIn: '10s' });
    res.json({ user, token });
  } catch (e) {
    res.status(400).json({ message: 'Not authorized' });
  }
});

router.get('/getUser', isVerified, (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: 'please log in' });
  }
});

module.exports = router;
