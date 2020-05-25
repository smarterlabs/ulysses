import { useEffect } from 'react'
import useUlysses from '@smarterlabs/ulysses/use-ulysses'
import merge from 'deepmerge'
import Client from 'shopify-buy'

export default function ShopifyPlugin({ clientOptions }) {
	const ulysses = useUlysses()
	useEffect(() => {
		const client = (Client && Client.buildClient) ? Client.buildClient(clientOptions) : {}

		// Load or create checkout ID
		let checkout

		async function onAddToCart(item) {
			console.log(`Shopify add to cart`)

			if (!item.shopifyId) {
				console.error(`"shopifyId" is required for addToCart method.`)
				return false
			}

			if (!checkout) {
				if (localStorage.checkoutId) {
					checkout = await client.checkout.fetch(localStorage.checkoutId)
				}
				else {
					checkout = await client.checkout.create()
				}
			}


			try {
				checkout = await client.checkout.addLineItems(checkout.id, [{
					variantId: item.shopifyId,
					quantity: item.quantity,
					customAttributes: [{ key: `ulyssesItem`, value: JSON.stringify(item) }],
				}])
				// console.log(`Shopify add item result`, checkout.lineItems[0])
			}
			catch(err){
				console.log(`Shopify addLineItems failed`)
				console.error(err)
				return false
			}


			return true
		}
		function onCheckout() {
			console.log(`Shopify checkout`)
			console.log(`checkout`)
		}

		let events = merge(ulysses.events, {
			addToCart: [onAddToCart],
			checkout: [onCheckout],
		})
		ulysses.setEvents(events)
	}, [])
	return null
}