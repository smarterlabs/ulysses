import React from 'react'
import { UlyssesReact, useCart, useCartContents } from '@smarterlabs/ulysses-react'

const WithUlysses = UlyssesReact()

const inventory = [
	{
		name: `Apple`,
		id: `A123`,
		totalQuantity: 5,
	},
	{
		name: `Banana`,
		id: `B123`,
		totalQuantity: 5,
	},
]

function Page(){
	const cart = useCart()
	const contents = useCartContents()
	return (
		<main>
			<section>
				{inventory.map((item, index) => (
					<button key={index} onClick={() => cart.add(item)}>Add {item.name}</button>
				))}
			</section>
			<ul>
				{contents.map((item, index) => (
					<li key={index}>{item.name} x{item.quantity}</li>
				))}
			</ul>
		</main>
	)
}

export default () => {

	return (
		<WithUlysses>
			<Page />
		</WithUlysses>
	)
}