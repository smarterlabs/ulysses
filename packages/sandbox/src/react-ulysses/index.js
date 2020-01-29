import React, { useContext, useState, useEffect } from 'react'
import { Ulysses } from '../../../core/src'

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
	return ulysses.cart
}

export function useCartContents(){
	const ulysses = useContext(Context)
	const [contents, setContents] = useState(ulysses.cart.contents)
	function onChange(contents){
		setContents([...contents])
	}
	useEffect(() => {
		if(typeof window === undefined) return
		ulysses.addEventListener(`cart.onChange`, onChange)
		return () => ulysses.removeEventListener(`cart.onChange`, onChange)
	}, [])
	return contents
}