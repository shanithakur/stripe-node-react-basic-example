import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './components/PaymentForm';

const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default App;
