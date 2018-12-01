const User = require('../DB/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = require('express').Router();
const isVerified = require('../helpers/userVerification');

router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ type: 'alert', message: user.email + ' успешно зарегистрирован', user });
  } catch (error) {
    if (error.errors) {
      if (error.errors.email) return res.status(400).json({ type: 'tooltip', message: 'Неверный формат email' });
      if (error.errors.password)
        return res.status(400).json({ type: 'tooltip', message: 'Минимальная длинна пароля 6 символов' });
    }

    if (error.name === 'MongoError' && error.code === 11000)
      return res.status(400).json({ type: 'alert', message: 'Пользователь с таким email уже зарегестрирован' });

    res.status(400).json({ error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!bcrypt.compareSync(req.body.password, user.password))
      return res.status(400).json({ message: 'Email или пароль неверны' });
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY); //, { expiresIn: '10s' });
    res.json({ user, token });
  } catch (e) {
    res.status(400).json({ message: 'Email или пароль неверны' });
  }
});

router.post('/checkEmail', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !!user ? res.json({ emailAlreadyRegistered: true }) : res.json({ emailAlreadyRegistered: false });
  } catch (error) {
    res.status(400).json({ message: error });
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
