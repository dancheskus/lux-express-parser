const User = require('../DB/models/user');
const bcrypt = require('bcrypt');

const router = require('express').Router();

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
    const decoded = bcrypt.compareSync(req.body.password, user.password);
    res.json(decoded);
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
