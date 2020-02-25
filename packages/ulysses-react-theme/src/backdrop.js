import React from 'react'
import { useUlysses } from '@smarterlabs/ulysses-plugin-react'

export default function UlyssesProductList(){
	const { cart } = useUlysses()
	return (
		<div className='ulyssesBackdrop' onClick={cart.close} />
	)
}