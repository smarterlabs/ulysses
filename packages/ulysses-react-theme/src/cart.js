import React from 'react'
import { useUlysses } from '@smarterlabs/ulysses-react'
import ProductList from './product-list'

export default function UlyssesReactTheme(){
	const { cart } = useUlysses()
	return (
		<div className='ulyssesCart'>
			<button className='ulyssesClose' onClick={cart.close}>X</button>
			<h1>Your Cart</h1>
			<ProductList />
		</div>
	)
}