import React from 'react'
import { useCartContents } from '@smarterlabs/ulysses-react'

export default function UlyssesProductList(){
	const contents = useCartContents()
	if(!contents.length){
		return(
			<div className='ulyssesCartEmpty'>Your cart is empty!</div>
		)
	}
	return (
		<ul className='ulyssesProductList'>
			{contents.map((item, index) => (
				<li key={index}>
					<div>{item.name}</div>
					<div>x{item.quantity}</div>
					<div>
						<button onClick={item.remove}>X</button>
					</div>
				</li>
			))}
		</ul>
	)
}