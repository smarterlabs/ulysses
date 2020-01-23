import React, { useState } from 'react'
import { Ulysses } from '../../../core/src'


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
const ulysses = new Ulysses()
window.ulysses = ulysses

export default () => {

	const [cartContents, setCartContents] = useState(ulysses.cart.contents)
	ulysses.addEventListener(`cart.onChange`, contents => {
		setCartContents([...contents])
	})


	return (
		<main>
			<section>
				<h2>Cart</h2>

				<h3>Actions</h3>
				<div>
					{inventory.map((obj, index) => (
						<button key={index} onClick={() => ulysses.cart.add(obj)}>
							Add {obj.name}
						</button>
					))}
				</div>

				<h3>Contents</h3>
				{cartContents.map((item ,index) => (
					<li key={index}>{item.name}</li>
				))}
			</section>
		</main>
	)
}