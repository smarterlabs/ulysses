import find from 'lodash/find'

export default async function remove({
	productId,
	setIsLoading,
	emit,
	lineItems,
	uid,
	setLineItems,
}) {
	if (!uid) {
		console.error(`"${uid}" is required to adjust quantity for line item "${productId}"`)
		return
	}
	const item = find(lineItems, o => o[uid] === productId)
	if(!item){
		console.error(`Item "${productId}" not found in cart`)
		return
	}
	setIsLoading(true)

	// Run events from plugins
	await emit(`remove`, item)

	let newLineItems = [...lineItems]
	for (let i = newLineItems.length; i--;) {
		const oldItem = newLineItems[i]
		if (oldItem[uid] === item[uid]) {
			newLineItems.splice(i, 1)
			break
		}
	}
	setLineItems(newLineItems)
	setIsLoading(false)
}