# Ulysses

**Note: work in progress**

An open source ecommerce solution build for static websites, but also works with any other site.

## Quick Start

```js
import { Ulysses } from 'ulysses'
import auth0Plugin from 'ulysses-plugin-auth0'
import stripePlugin from 'ulysses-plugin-stripe'

const ulysses = new Ulysses({
  plugins: [
    auth0Plugin({
      apiKey: process.env.AUTH0_KEY,
    }),
    stripePlugin({
      apiKey: process.env.STRIPE_KEY,
    }),
  ]
})

ulysses.cart.add({
  id: `A123`,
  title: `Apple`,
  quantity: 2,
  price: 300, // Cents
})

```