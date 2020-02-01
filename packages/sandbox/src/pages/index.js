import React from 'react'
import { useUlysses, useSubtotal, useTotalQuantity } from '@smarterlabs/ulysses-react'
import Theme from '@smarterlabs/ulysses-react-theme'
import '@smarterlabs/ulysses-react-theme/dist/style.css'


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

export default function Page(){
	const { cart } = useUlysses()
	const subtotal = useSubtotal()
	const totalQuantity = useTotalQuantity()
	return (
		<main>
			<section>
				<button onClick={cart.open}>Open Cart</button>
			</section>
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
			<Theme />
			<div>Total Quantity: x{totalQuantity}</div>
			<div>Subtotal: {subtotal}</div>
		</main>
	)
}