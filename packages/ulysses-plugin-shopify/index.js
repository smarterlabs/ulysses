import { useEffect } from 'react'
import useUlysses from '@smarterlabs/ulysses/use-ulysses'
import merge from 'deepmerge'
import Client from 'shopify-buy'

export default function ShopifyPlugin(options) {
	options = {
		localStorageKey: `ulyssesShopify-v1`,
		...options,
	}
	const ulysses = useUlysses()
	useEffect(() => {
		const client = (Client && Client.buildClient) ? Client.buildClient(options.client) : {}

		// Load or create checkout ID
		let checkout

		async function getCheckout(){
			if (!checkout) {
				const lsId = localStorage.getItem(options.localStorageKey)
				if (lsId) {
					checkout = await client.checkout.fetch(lsId)
					if(!ulysses.lineItems.length){
						let items = []
						checkout.lineItems.forEach(item => {
							item.customAttributes.forEach(({key, value}) => {
								if(key === `ulyssesItem`){
									items.push({
										...JSON.parse(value),
										lineItemId: item.id,
										quantity: item.quantity,
									})
								}
							})
						})
						ulysses.setLineItems(items)
					}
				}
				else {
					console.log(`Creating new checkout`)
					checkout = await client.checkout.create()
				}
			}
			localStorage.setItem(options.localStorageKey, checkout.id)
			return checkout
		}
		!async function(){
			checkout = await getCheckout()
		}()

		async function onAdjustQuantity(item, amount){
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
				checkout = await client.checkout.updateLineItems(checkout.id, [newItem])
			}
			catch (err) {
				console.error(err)
				return false
			}
			return true
		}

		async function onAddToCart(item) {
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
						item.lineItemId = lineItem.id
					}
				})
			}
			catch(err){
				console.error(err)
				return false
			}
			return true
		}



		async function onRemove(item) {
			if (!item.lineItemId) {
				console.error(`"lineItemId" is required for remove method.`)
				return false
			}
			checkout = await getCheckout()
			try {
				checkout = await client.checkout.removeLineItems(checkout.id, [item.lineItemId])
			}
			catch (err) {
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