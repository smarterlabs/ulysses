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

		async function getCheckout(){
			if (checkout) return checkout
			if (localStorage.checkoutId) {
				console.log(`Loading checkout from localStorage`)
				return await client.checkout.fetch(localStorage.checkoutId)
			}
			console.log(`Creating new checkout`)
			return await client.checkout.create()
		}

		async function onAdjustQuantity(item, amount){
			console.log(`Shopify adjust quantity`)
			if (!item.lineItemId){
				console.error(`"lineItemId" is required for onAdjustQuantity method.`)
				return false
			}
			checkout = await getCheckout()
			try {
				const newItem = {
					id: item.lineItemId,
					quantity: item.quantity + amount,
					// customAttributes: [{ key: `ulyssesItem`, value: JSON.stringify(item) }],
				}
				console.log(`Updating Shopify item`, newItem)
				checkout = await client.checkout.updateLineItems(checkout.id, [newItem])
				console.log(`Shopify adjust quantity result`, checkout.lineItems)
			}
			catch (err) {
				console.log(`Shopify onAdjustQuantity failed`)
				console.error(err)
				return false
			}
			return true
		}

		async function onAddToCart(item) {
			console.log(`Shopify add to cart`)
			if (!item.shopifyId) {
				console.error(`"shopifyId" is required for addToCart method.`)
				return false
			}
			checkout = await getCheckout()
			try {
				checkout = await client.checkout.addLineItems(checkout.id, [{
					variantId: item.shopifyId,
					quantity: item.quantity,
					customAttributes: [{ key: `ulyssesItem`, value: JSON.stringify(item) }],
				}])
				checkout.lineItems.forEach(lineItem => {
					if (lineItem.variant.id === item.shopifyId){
						console.log(`Set Shopify line item ID`)
						item.lineItemId = lineItem.id
					}
				})
			}
			catch(err){
				console.log(`Shopify addLineItems failed`)
				console.error(err)
				return false
			}
			return true
		}



		async function onRemove(item) {
			console.log(`Shopify remove`)
			if (!item.lineItemId) {
				console.error(`"lineItemId" is required for remove method.`)
				return false
			}
			checkout = await getCheckout()
			try {
				checkout = await client.checkout.removeLineItems(checkout.id, [item.lineItemId])
				console.log(`Shopify remove result`, checkout.lineItems)
			}
			catch (err) {
				console.log(`Shopify remove failed`)
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
			adjustQuantity: [onAdjustQuantity],
			checkout: [onCheckout],
			remove: [onRemove],
		})
		ulysses.setEvents(events)
	}, [])
	return null
}