import React, { useContext, useState, useEffect } from 'react'
import { pluginWrapper } from '@smarterlabs/ulysses-js'


export const Context = React.createContext()


export function UlyssesProvider({ ulysses, children }) {
	return (
		<Context.Provider value={ulysses}>
			{children}
		</Context.Provider>
	)
}

class UlyssesReactPlugin {

	constructor(ulysses) {

		function UlyssesProvider({ children }) {
			return (
				<Context.Provider value={ulysses}>
					{children}
				</Context.Provider>
			)
		}


		ulysses.react = {
			UlyssesProvider,
			Context,
			useUlysses,
			useCartIsOpen,
			useCartContents,
			useSubtotal,
			useTotalQuantity,
		}
	}
}

export default pluginWrapper(UlyssesReactPlugin)



export function useUlysses() {
	return useContext(Context)
}




function createHook(options){
	let { event, initial, update, expose } = options
	if (!initial) initial = expose
	if (!update) update = expose
	return () => {
		const ulysses = useUlysses()
		const [contents, setContents] = useState(initial(ulysses))
		function onChange() {
			setContents(update(ulysses))
		}
		useEffect(() => {
			if (typeof window === undefined) return
			ulysses.addEventListener(event, onChange)
			return () => ulysses.removeEventListener(event, onChange)
		}, [])
		return expose(ulysses, contents)
	}
}

export const useCartIsOpen = createHook({
	event: `cart.onToggle`,
	expose: ({ cart }) => cart.isOpen,
})

export const useCartContents = createHook({
	event: `cart.onChange`,
	update: ({ cart }) => [...cart.contents],
	expose: ({ cart }) => cart.contents,
})

export const useSubtotal = createHook({
	event: `cart.onChange`,
	expose: ({ cart }) => cart.subtotal,
})

export const useTotalQuantity = createHook({
	event: `cart.onChange`,
	expose: ({ cart }) => cart.totalQuantity,
})