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
	const items = (Array.isArray(item) ? item : [item]).map(item => {
		return {
			price: 0,
			quantity: 1,
			...item,
		}
	})

	// Run events from plugins
	try {
		await emit(`addToCart`, items)
	}
	catch(err){
		console.log(`addToCart failed`)
		console.error(err)
	}

	let newLineItems = [...lineItems]

	items.forEach(item => {
		let updatedItem = false
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
	})



	clearEmpty(lineItems)
	setLineItems(newLineItems)
	setIsLoading(false)
}