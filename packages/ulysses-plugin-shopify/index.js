import { useEffect } from 'react'
import useUlysses from '@smarterlabs/ulysses/use-ulysses'
import merge from 'deepmerge'

export default function ShopifyPlugin() {
	console.log(`ShopifyPlugin`)
	const ulysses = useUlysses()
	useEffect(() => {
		let events = merge(ulysses.events, {
			addToCart: [
				async item => {
					console.log(`Shopify add to cart`)
					if (!item.shopifyId) {
						console.error(`"shopifyId" is required for addToCart method.`)
					}
				},
			],
			checkout: [
				() => {
					console.log(`Shopify checkout`)
					console.log(`checkout`)
				},
			],
		})
		ulysses.setEvents(events)
		return () => {
			console.log(`Unmounting plugin`)
		}
	}, [])
	return null
}