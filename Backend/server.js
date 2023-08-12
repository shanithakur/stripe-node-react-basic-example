const express = require('express');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3001; // You can change this port as needed

app.use(express.json());
app.use(cors()); // Use the cors middleware


// Create a Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'inr', // Change to your desired currency
      metadata: {
        description: 'Export of goods XYZ',
      },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
