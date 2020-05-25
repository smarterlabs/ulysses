import React, { useReducer } from 'react'
import Context from './context'
import { eventsReducer, on, emit } from './events'

export default function TestProvider({ children }){
	const [events, eventsDispatch] = useReducer(eventsReducer, {})
	const [lineItems, lineItemsDispatch] = useReducer(lineItemsReducer, {})

	return(
		<Context.Provider value={{
			events,
			eventsDispatch,
			on: on.bind(null, eventsDispatch),
			emit: emit.bind(null, eventsDispatch),
		}}>
			{children}
		</Context.Provider>
	)
}