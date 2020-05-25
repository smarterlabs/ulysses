import React, { useState, useEffect } from 'react'
import Context from './context'
import addToCart from './add-to-cart'
import emit from './emit'
import checkout from './checkout'
import adjustQuantity from './adjust-quantity'

export default function UlyssesProvider({
	children,
	plugins = [],
	uid = `sku`,
}){
	const [lineItems, setLineItems] = useState([])
	const [pricing, setPricing] = useState({})
	const [inventory, setInventory] = useState({})
	const [totalQuantity, setTotalQuantity] = useState(0)
	const [totalPrice, setTotalPrice] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [cartIsOpen, setCartIsOpen] = useState(false)
	const [events, setEvents] = useState({
		openCart: [() => setCartIsOpen(true)],
		closeCart: [() => setCartIsOpen(false)],
	})

	// Update total quantity and price when line items update
	useEffect(() => {
		let newTotalQuantity = 0
		let newTotalPrice = 0
		for(let i = lineItems.length; i--;){
			newTotalQuantity += lineItems[i].quantity || 1
			newTotalPrice += (lineItems[i].price * lineItems[i].quantity) || 0
		}
		setTotalQuantity(newTotalQuantity)
		setTotalPrice(newTotalPrice)
	}, [lineItems])

	// Exposed via useUlysses
	const ulysses = {
		uid,
		lineItems,
		setLineItems,
		pricing,
		setPricing,
		inventory,
		setInventory,
		totalQuantity,
		totalPrice,
		plugins,
		emit,
		isLoading,
		setIsLoading,
		events,
		setEvents,
		cartIsOpen,
		setCartIsOpen,
	}
	ulysses.addToCart = item => addToCart({ item, ...ulysses })
	ulysses.emit = (label, ...args) => emit({ label, args, ...ulysses })
	ulysses.checkout = () => checkout(ulysses)
	ulysses.adjustQuantity = (productId, amount) => adjustQuantity({productId, amount, ...ulysses})

	return(
		<Context.Provider value={ulysses}>
			{children}
		</Context.Provider>
	)
}