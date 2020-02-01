import React from 'react'
import { useCartContents } from '@smarterlabs/ulysses-react'

export default function UlyssesReactTheme(){
	const contents = useCartContents()
	return (
		<div className='ulysses'>
			<ul>
				{contents.map((item, index) => (
					<li key={index}>{item.name} x{item.quantity}</li>
				))}
			</ul>
		</div>
	)
}