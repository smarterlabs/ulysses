import clearEmpty from './clear-empty-line-items'

export default async function addToCart({
	item,
	setIsLoading,
	emit,
	lineItems,
	uid,
	setLineItems,
}) {
	setIsLoading(true)
	item = {
		price: 0,
		quantity: 1,
		...item,
	}

	// Run events from plugins
	const result = await emit(`addToCart`, item)
	if (!result) {
		console.error(`addToCart failed`)
		return setIsLoading(false)
	}

	let updatedItem = false
	let newLineItems = [...lineItems]
	if (uid) {
		for (let i = newLineItems.length; i--;) {
			const oldItem = newLineItems[i]
			if (oldItem[uid] === item[uid]) {
				let quantity = oldItem.quantity + item.quantity
				for (let i in item) {
					oldItem[i] = item[i]
				}
				oldItem.quantity = quantity
				updatedItem = true
				break
			}
		}
	}
	if (!updatedItem) {
		newLineItems.push(item)
	}
	clearEmpty(lineItems)
	setLineItems(newLineItems)
	setIsLoading(false)
}