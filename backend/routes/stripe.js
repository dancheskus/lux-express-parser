const router = require('express').Router();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

router.post('/charge', async ({ body: { email, amount, token } }, res) => {
  try {
    let { status } = await stripe.charges.create({
      amount,
      currency: 'eur',
      source: token,
    });

    res.json({ status });
  } catch (err) {
    res.status(500).end();
  }
});

module.exports = router;
