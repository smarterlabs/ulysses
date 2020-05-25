import React, { useState, useEffect, useReducer } from 'react'
import Context from './context'
import addToCart from './add-to-cart'
import checkout from './checkout'
import adjustQuantity from './adjust-quantity'
import remove from './remove'

function eventsReducer(oldEvents, { type, label, fn, cb, data }) {

	// Add event
	if (type === `on`) {
		const events = { ...oldEvents }
		if (!events[label]) {
			events[label] = []
		}
		events[label].push(fn)
		return events
	}

	// Emit event
	if (type === `emit`) {
		if (!oldEvents[label]) {
			console.error(`Emitting event label`, label, `not found`)
			return oldEvents
		}
		runEvents(oldEvents[label], cb, data)
		return oldEvents
	}
}
async function runEvents(events, cb, data) {
	for (let i = 0; i < events.length; i++) {
		await events[i](data)
	}
	cb()
}

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
	const [isLoading, setIsLoading] = useState(true)
	const [cartIsOpen, setCartIsOpen] = useState(false)
	const [hasInit, setHasInit] = useState(false)
	const [events, eventsDispatch] = useReducer(eventsReducer, {})


	function on(label, fn) {
		eventsDispatch({ label, fn, type: `on` })
	}
	function emit(label, data) {
		return new Promise((resolve) => {
			eventsDispatch({
				label,
				type: `emit`,
				cb: resolve,
				data,
			})
		})
	}


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
				localStorage.setItem(localStorageKey, JSON.stringify(state))
			}
			setHasInit(true)
		}
		saveState()

	}, [lineItems, hasInit, setHasInit])

	// Load from localStorage
	useEffect(() => {
		let state = localStorage.getItem(localStorageKey)
		if (!state){
			setIsLoading(false)
			return
		}
		state = JSON.parse(state)
		async function loadState(){
			await ulysses.emit(`loadState`, { ...ulysses, state })
			if (state.lineItems) {
				setLineItems(state.lineItems)
			}
			setIsLoading(false)
		}
		loadState()
	}, [])

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
		on,
		emit,
		isLoading,
		setIsLoading,
		cartIsOpen,
		events,
		setCartIsOpen,
	}
	ulysses.addToCart = item => addToCart({ item, ...ulysses })
	ulysses.checkout = () => checkout(ulysses)
	ulysses.adjustQuantity = (productId, amount) => adjustQuantity({ productId, amount, ...ulysses })
	ulysses.remove = productId => remove({ productId, ...ulysses })

	return(
		<Context.Provider value={ulysses}>
			{children}
		</Context.Provider>
	)
}