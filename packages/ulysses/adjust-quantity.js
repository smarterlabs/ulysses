import find from 'lodash/find'
import clearEmpty from './clear-empty-line-items'

export default async function updateQuantity({
	productId,
	amount,
	lineItems,
	setLineItems,
	emit,
	uid,
}) {
	let lineItem
	let newLineItems = [...lineItems]
	if(!uid) {
		console.log(`"${uid}" is required to adjust quantity for line item "${productId}"`)
		return false
	}
	lineItem = find(newLineItems, o => o[uid] === productId)
	if (!lineItem) {
		console.error(`Line item "${productId}" not found`)
		console.error(`Line item "${productId}" not found`)
		return false
	}

	// Run events from plugins
	const result = await emit(`adjustQuantity`, lineItem, amount)
	if (!result) {
		console.error(`addToCart failed`)
		return
	}

	lineItem.quantity += amount
	clearEmpty(newLineItems)
	setLineItems(newLineItems)
}