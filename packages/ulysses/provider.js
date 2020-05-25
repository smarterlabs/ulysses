import React, { useState, useEffect } from 'react'
import Context from './context'
import addToCart from './add-to-cart'
import emit from './emit'
import checkout from './checkout'
import adjustQuantity from './adjust-quantity'
import remove from './remove'

export default function UlyssesProvider({
	children,
	plugins = [],
	localStorageKey = `ulysses-v1`,
	uid = `sku`,
}){
	const [lineItems, setLineItems] = useState([])
	const [pricing, setPricing] = useState({})
	const [inventory, setInventory] = useState({})
	const [totalQuantity, setTotalQuantity] = useState(0)
	const [totalPrice, setTotalPrice] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [cartIsOpen, setCartIsOpen] = useState(false)
	const [hasInit, setHasInit] = useState(false)
	const [events, setEvents] = useState({
		openCart: [() => setCartIsOpen(true)],
		closeCart: [() => setCartIsOpen(false)],
	})


	useEffect(() => {
		// Update total quantity and price when line items update
		let newTotalQuantity = 0
		let newTotalPrice = 0
		for(let i = lineItems.length; i--;){
			newTotalQuantity += lineItems[i].quantity || 1
			newTotalPrice += (lineItems[i].price * lineItems[i].quantity) || 0
		}
		setTotalQuantity(newTotalQuantity)
		setTotalPrice(newTotalPrice)

		async function saveState() {
			// Save to localStorage
			if (hasInit) {
				let state = { lineItems }
				await ulysses.emit(`saveState`, { ...ulysses, state })
				console.log(`Saving state to ${localStorageKey}`)
				localStorage.setItem(localStorageKey, JSON.stringify(state))
			}
			setHasInit(true)
		}
		saveState()

	}, [lineItems, hasInit, setHasInit])

	// Load from localStorage
	useEffect(() => {
		console.log(`Loading state from ${localStorageKey}`)
		let state = localStorage.getItem(localStorageKey)
		if (!state){
			console.log(`ls not found`)
			return
		}
		state = JSON.parse(state)
		async function loadState(){
			await emit({ ...ulysses, label: `loadState`, state })
			console.log(`Emitted load state`)
			if (state.lineItems) {
				setLineItems(state.lineItems)
			}
		}
		setTimeout(loadState, 1000)
		// loadState()
	}, [emit])

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
	ulysses.adjustQuantity = (productId, amount) => adjustQuantity({ productId, amount, ...ulysses })
	ulysses.remove = productId => remove({ productId, ...ulysses })

	return(
		<Context.Provider value={ulysses}>
			{children}
		</Context.Provider>
	)
}