import React, { useState } from 'react'
import { Ulysses } from '../../../core/src'


export default () => {
	const ulysses = new Ulysses()
	console.log(ulysses)
	const [cartContents, setCartContents] = useState(ulysses.cart.contents)
	ulysses.addEventListener(`cart.onChange`, contents => {
		setCartContents(contents)
	})
	return (
		<main>
			<section>
				<h2>Cart</h2>
				<div>
					<button onClick={() => ulysses.cart.add({
						id: `A1`,
						name: `Apple`,
						quantity: 1,
					})}>
						Add Item
					</button>
				</div>
				{cartContents.map((item ,index) => (
					<li key={index}>{item.name}</li>
				))}
			</section>
		</main>
	)
}