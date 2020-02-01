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

export function useCart(){
	const ulysses = useContext(Context)
	const { cart } = ulysses
	const [contents, setContents] = useState(cart.contents)
	function onChange(contents){
		setContents([...contents])
	}
	useEffect(() => {
		if(typeof window === undefined) return
		ulysses.addEventListener(`cart.onChange`, onChange)
		return () => ulysses.removeEventListener(`cart.onChange`, onChange)
	}, [])
	return {
		cart,
		contents,
		subtotal: cart.subtotal,
	}
}