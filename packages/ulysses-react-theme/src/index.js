import React from 'react'
import { useCartIsOpen } from '@smarterlabs/ulysses-react'
import Backdrop from './backdrop'
import Cart from './cart'

export default function UlyssesReactTheme(){
	const isOpen = useCartIsOpen()
	return (
		<div className={`ulysses ${isOpen ? `ulyssesCartOpen` : `ulyssesCartClosed`}`}>
			<Backdrop />
			<Cart />

		</div>
	)
}