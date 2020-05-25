import find from 'lodash/find'
import clearEmpty from './clear-empty-line-items'

export default function updateQuantity({
	productId,
	amount,
	lineItems,
	setLineItems,
	uid,
}) {
	let lineItem
	let newLineItems = [...lineItems]
	if (uid) {
		lineItem = find(newLineItems, o => o[uid] === productId)
		if (lineItem) {
			lineItem.quantity += amount
			clearEmpty(newLineItems)
			setLineItems(newLineItems)
		}
		else {
			console.error(`Line item "${productId}" not found`)
		}
	}
	else {
		console.log(`"${uid}" is required to adjust quantity for line item "${productId}"`)
	}
}