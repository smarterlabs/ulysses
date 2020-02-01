import React from 'react'
import { UlyssesReact } from '@smarterlabs/ulysses-react'

const UlyssesProvider = new UlyssesReact()

export function wrapRootElement({ element }) {
	return (
		<UlyssesProvider>
			{element}
		</UlyssesProvider>
	)
}