// lib/stripe.ts or utils/stripe.ts

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any, // Force it
});


export default stripe;
