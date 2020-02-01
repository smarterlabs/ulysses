import React, { useContext, useState, useEffect } from 'react'
import { Ulysses } from '@smarterlabs/ulysses-js'

export const Context = React.createContext()

export function UlyssesReact(options){
	const ulysses = new Ulysses(options)

	return function UlyssesProvider({ children }){
		return (
			<Context.Provider value={ulysses}>
				{children}
			</Context.Provider>
		)
	}
}

export function useUlysses(){
	return useContext(Context)
}

function createHook(options){
	let { event, initial, update, expose } = options
	if (!update) update = initial
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

export const useCartContents = createHook({
	event: `cart.onChange`,
	initial: ({ cart }) => cart.contents,
	update: ({ cart }) => [...cart.contents],
	expose: ({ cart }) => cart.contents,
})

export const useSubtotal = createHook({
	event: `cart.onChange`,
	initial: ({ cart }) => cart.subtotal,
	update: ({ cart }) => cart.subtotal,
	expose: ({ cart }) => cart.subtotal,
})