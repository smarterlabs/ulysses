import React from 'react'
import { UlyssesReact, useCart, useContents } from '../react-ulysses'

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
	const contents = useContents()
	return (
		<main>
			<section>
				<button onClick={() => cart.add(inventory[0])}>Add Apple</button>
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