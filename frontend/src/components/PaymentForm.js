import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './PaymentForm.css';


const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const API_BASE_URL = 'http://localhost:3001'; // Replace with your actual backend server URL



  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements || isProcessing) {
      return;
    }
  
    setIsProcessing(true);
    setPaymentError(null);
  
    const { token, error } = await stripe.createToken(elements.getElement(CardElement));
    console.log(token)
    if (error) {
      setPaymentError(error.message);
      setIsProcessing(false);
      return;
    }
  
    try {
        const response = await axios.post(`${API_BASE_URL}/create-payment-intent`, {
            amount: 100, // Amount in cents
        });
  
      const clientSecret = response.data.clientSecret;
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setPaymentError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
      } else {
        setPaymentError('Payment failed. Please try again later.');
      }
    } catch (error) {
      setPaymentError('An error occurred. Please try again.');
    }
  
    setIsProcessing(false);
  };
  

  return (
    <div className="payment-form-container">
      <form onSubmit={handleSubmit} className="payment-form">
        <CardElement
          className="card-element"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: false,
          }}
        />
        <button type="submit" className="pay-button" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay'}
        </button>
      </form>
      {paymentError && <p className="error-message">{paymentError}</p>}
      {paymentSuccess && <p className="success-message">Payment successful!</p>}
    </div>
  );
};

export default PaymentForm;
