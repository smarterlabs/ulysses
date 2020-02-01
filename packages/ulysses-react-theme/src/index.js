import React from 'react'
import { useCartIsOpen } from '@smarterlabs/ulysses-react'
import ProductList from './product-list'
import Backdrop from './backdrop'

export default function UlyssesReactTheme(){
	const isOpen = useCartIsOpen()
	return (
		<div className={`ulysses ${isOpen ? `ulyssesCartOpen` : `ulyssesCartClosed`}`}>
			<Backdrop />
			<div className='ulyssesCart'>
				<ProductList />
			</div>

		</div>
	)
}