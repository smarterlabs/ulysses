import find from 'lodash/find'
import clearEmpty from './clear-empty-line-items'

export default async function updateQuantity({
	productId,
	amount,
	lineItems,
	setLineItems,
	emit,
	uid,
	setIsLoading,
}) {
	let lineItem
	let newLineItems = [...lineItems]
	if(!uid) {
		console.log(`"${uid}" is required to adjust quantity for line item "${productId}"`)
	}
	setIsLoading(true)
	lineItem = find(newLineItems, o => o[uid] === productId)
	if (!lineItem) {
		console.error(`Line item "${productId}" not found`)
		console.error(`Line item "${productId}" not found`)
		return setIsLoading(false)
	}

	// Run events from plugins
	await emit(`adjustQuantity`, { lineItem, amount })

	lineItem.quantity += amount
	clearEmpty(newLineItems)
	setLineItems(newLineItems)
	setIsLoading(false)
}