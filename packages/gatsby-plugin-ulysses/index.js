import React from 'react'
import { Ulysses } from '@smarterlabs/ulysses-js'
import reactPlugin from '@smarterlabs/ulysses-plugin-react'
import Theme from '@smarterlabs/ulysses-react-theme'

export default function wrapRootElement({ element }, { plugins, ...options }) {
	const ulysses = new Ulysses({
		...options,
		plugins: [
			reactPlugin(),
			...plugins,
		],
	})
	return (
		<ulysses.react.UlyssesProvider>
			{element}
			<Theme />
		</ulysses.react.UlyssesProvider>
	)
}