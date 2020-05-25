import React, { useState, useEffect } from 'react'
import Context from './context'
import addToCart from './add-to-cart'
import checkout from './checkout'
import adjustQuantity from './adjust-quantity'
import remove from './remove'
import EventsProvider from '@smarterlabs/react-events/provider'
import useEvents from '@smarterlabs/react-events'

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
	const { on, emit } = useEvents()
	console.log(`on`, on)

	useEffect(() => {
		on(`openCart`, () => setCartIsOpen(true))
		on(`closeCart`, () => setCartIsOpen(false))
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
		isLoading,
		setIsLoading,
		on,
		emit,
		cartIsOpen,
		setCartIsOpen,
	}
	ulysses.addToCart = item => addToCart({ item, ...ulysses })
	ulysses.checkout = () => checkout(ulysses)
	ulysses.adjustQuantity = (productId, amount) => adjustQuantity({ productId, amount, ...ulysses })
	ulysses.remove = productId => remove({ productId, ...ulysses })

	return(
		<EventsProvider>
			<Context.Provider value={ulysses}>
				{children}
			</Context.Provider>
		</EventsProvider>
	)
}