import React from 'react'
import { useUlysses, useCartContents, useSubtotal } from '@smarterlabs/ulysses-plugin-react'
import ProductList from './product-list'
import formatUsd from './format-usd'

export default function UlyssesReactTheme() {
	const contents = useCartContents()
	const subtotal = useSubtotal()
	const { checkout, cart } = useUlysses()
	return (
		<div className='ulyssesCart'>
			<button className='ulyssesClose' onClick={cart.close}>X</button>
			<h1>Your Cart</h1>
			{contents.length === 0 ? (
				<div className='ulyssesCartEmpty'>Your cart is empty!</div>
			) : (
				<>
					<ProductList />
					<div>Subtotal: {formatUsd(subtotal)}</div>
					<div>
						<button onClick={checkout.start}>Checkout</button>
					</div>
				</>
			)}
		</div>
	)
}