import useUlysses from './use-ulysses'
import find from 'lodash/find'
import clearEmpty from './clear-empty-line-items'

export default function useUpdateQuantity(){
	const { lineItems, setLineItems, uid } = useUlysses()

	function updateQuantity(productId, amount){
		let lineItem
		let newLineItems = [...lineItems]
		if(uid){
			lineItem = find(newLineItems, o => o[uid] === productId)
			if (lineItem) {
				lineItem.quantity += amount
				clearEmpty(newLineItems)
				setLineItems(newLineItems)
			}
			else{
				console.error(`Line item ${productId} not found`)
			}
		}
		else{
			console.log(`UID is required to update quantity for line item ${productId}`)
		}
	}

	return updateQuantity
}