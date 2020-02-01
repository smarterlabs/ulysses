import React from 'react'
import { useCartContents } from '@smarterlabs/ulysses-react'

export default function UlyssesProductList(){
	const contents = useCartContents()
	return (
		<ul className='ulyssesProductList'>
			{contents.map((item, index) => (
				<li key={index}>{item.name} x{item.quantity}</li>
			))}
		</ul>
	)
}