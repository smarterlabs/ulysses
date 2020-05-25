import useUlysses from './use-ulysses'
import clearEmpty from './clear-empty-line-items'

export default function useAddToCart(){
	const { lineItems, setLineItems, uid, emit, setIsAddingToCart } = useUlysses()

	async function addToCart(item){
		console.log(`addToCart`)
		setIsAddingToCart(true)
		item = {
			price: 0,
			quantity: 1,
			...item,
		}
		const result = await emit(`addToCart`, item)
		if(!result){
			console.error(`addToCart failed`)
			return
		}
		let updatedItem = false
		let newLineItems = [...lineItems]
		if(uid){
			for(let i = newLineItems.length; i--;){
				const oldItem = newLineItems[i]
				if (oldItem[uid] === item[uid]) {
					let quantity = oldItem.quantity + item.quantity
					for(let i in item){
						oldItem[i] = item[i]
					}
					oldItem.quantity = quantity
					updatedItem = true
					break
				}
			}
		}
		if (!updatedItem){
			newLineItems.push(item)
		}
		clearEmpty(lineItems)
		setLineItems(newLineItems)
		setIsAddingToCart(false)
	}

	return addToCart
}