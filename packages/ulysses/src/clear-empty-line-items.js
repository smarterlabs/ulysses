export default function clearEmptyLineItems(items){
	for(let i = items.length; i--;){
		if(items[i].quantity < 1){
			console.log(`Removing item`)
			items.splice(i, 1)
		}
	}
}