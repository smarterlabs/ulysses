import React, { useState, useEffect } from 'react'
import Context from './context'

export default function UlyssesProvider({ children, plugins = [], uid = `sku` }){
	const [lineItems, setLineItems] = useState([])
	const [pricing, setPricing] = useState({})
	const [inventory, setInventory] = useState({})
	const [totalQuantity, setTotalQuantity] = useState(0)
	const [totalPrice, setTotalPrice] = useState(0)
	const [events, setEvents] = useState({})
	const [isAddingToCart, setIsAddingToCart] = useState(false)

	async function emit(label, ...args){
		if (!events[label]) return
		await Promise.all(events[label].map(fn => fn(...args)))
	}

	useEffect(() => {
		// Update total quantity and price
		let newTotalQuantity = 0
		let newTotalPrice = 0
		for(let i = lineItems.length; i--;){
			newTotalQuantity += lineItems[i].quantity || 1
			newTotalPrice += lineItems[i].price || 0
		}
		setTotalQuantity(newTotalQuantity)
		setTotalPrice(newTotalPrice)
	}, [lineItems])

	return(
		<Context.Provider value={{
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
			isAddingToCart,
			setIsAddingToCart,
			events,
			setEvents,
		}}>
			{children}
		</Context.Provider>
	)
}