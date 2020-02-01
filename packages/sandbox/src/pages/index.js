import React from 'react'
import { UlyssesReact, useCartContents, useUlysses, useSubtotal, useTotalQuantity } from '@smarterlabs/ulysses-react'

const WithUlysses = UlyssesReact()

const inventory = [
	{
		name: `Apple`,
		id: `A123`,
		totalQuantity: 5,
		price: 100,
	},
	{
		name: `Banana`,
		id: `B123`,
		totalQuantity: 5,
		price: 80,
	},
]

function Page(){
	const { cart } = useUlysses()
	const contents = useCartContents()
	const subtotal = useSubtotal()
	const totalQuantity = useTotalQuantity()
	return (
		<main>
			<section>
				{inventory.map((item, index) => (
					<button key={index} onClick={() => cart.add(item)}>Add {item.name}</button>
				))}
			</section>
			<section>
				{inventory.map((item, index) => (
					<button key={index} onClick={() => cart.remove(item.id)}>Remove {item.name}</button>
				))}
			</section>
			<ul>
				{contents.map((item, index) => (
					<li key={index}>{item.name} x{item.quantity}</li>
				))}
			</ul>
			<div>Total Quantity: x{totalQuantity}</div>
			<div>Subtotal: {subtotal}</div>
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