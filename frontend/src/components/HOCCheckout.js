import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

const HOCCheckout = () => {
  return (
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY}>
      <Elements>
        <CheckoutForm />
      </Elements>
    </StripeProvider>
  );
};

export default HOCCheckout;
