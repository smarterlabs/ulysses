import { useEffect } from 'react'
import useUlysses from '@smarterlabs/ulysses/use-ulysses'
import Client from 'shopify-buy'

export default function ShopifyPlugin(options) {
	const ulysses = useUlysses()
	useEffect(() => {
		const client = (Client && Client.buildClient) ? Client.buildClient(options.client) : {}

		// Load or create checkout ID
		let checkout

		async function getCheckout(){
			if (!checkout) {
				console.log(`Creating new checkout`)
				checkout = await client.checkout.create()
			}
			return checkout
		}

		async function onAdjustQuantity(args){
			console.log(`args`, args)
			let { lineItem, amount } = args
			if (!lineItem.lineItemId){
				console.error(`"lineItemId" is required for onAdjustQuantity method.`)
				return false
			}
			checkout = await getCheckout()
			try {
				const newItem = {
					id: lineItem.lineItemId,
					quantity: lineItem.quantity + amount,
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
			let href = checkout.webUrl
			if (options.development) {
				href = `${href}?fts=0&preview_theme_id=${process.env.GATSBY_SHOPIFY_THEME_ID}`
			}
			window.location.href = href
		}

		async function onSaveState({ state }){
			console.log(`Shopify save state`, state)
			checkout = await getCheckout()
			if(!checkout || !checkout.id){
				console.warn(`"checkout.id" not found when saving state`)
				return
			}
			state.shopifyCheckoutId = checkout.id
		}
		async function onLoadState({ state }) {
			console.log(`Shopify load state`, JSON.stringify(state), typeof state)
			if (!state.shopifyCheckoutId){
				console.warn(`"shopifyCheckoutId" not found in loaded state`)
				return
			}
			checkout = await client.checkout.fetch(state.shopifyCheckoutId)
		}

		ulysses.on(`addToCart`, onAddToCart)
		ulysses.on(`adjustQuantity`, onAdjustQuantity)
		ulysses.on(`checkout`, onCheckout)
		ulysses.on(`remove`, onRemove)
		ulysses.on(`saveState`, onSaveState)
		ulysses.on(`loadState`, onLoadState)
	}, [])
	return null
}