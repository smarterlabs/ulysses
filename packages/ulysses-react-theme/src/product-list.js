import React from 'react'
import { useCartContents } from '@smarterlabs/ulysses-react'

export default function UlyssesProductList(){
	const contents = useCartContents()
	return (
		<ul className='ulyssesProductList'>
			{contents.map((item, index) => (
				<li key={index}>
					<div>{item.name}</div>
					<div>x{item.quantity}</div>
					<div>
						{console.log(item)}
						<button onClick={item.remove}>X</button>
					</div>
				</li>
			))}
		</ul>
	)
}