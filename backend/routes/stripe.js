const router = require('express').Router();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const User = require('../DB/models/user');

const jwt = require('jsonwebtoken');

router.post('/charge', async ({ body: { email, amount, stripeToken, userToken } }, res) => {
  try {
    let { status } = await stripe.charges.create({
      amount,
      currency: 'eur',
      source: stripeToken,
    });

    User.findByIdAndUpdate(
      jwt.verify(userToken, process.env.SECRET_KEY).id,
      { payedUntil: Date.now() + 31556952000 },
      { new: true }
    )
      .then(user => {
        res.json({ status, user });
      })
      .catch(e => console.log(e));
  } catch (err) {
    res.status(500).end();
  }
});

module.exports = router;

// one year 31556952000
