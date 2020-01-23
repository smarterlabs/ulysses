import { pluginWrapper } from './index'

class Cart {
	constructor(ulysses, options){
		ulysses.cart = this
		this.ulysses = ulysses
		this.contents = options.contents || []
	}
	add(product) {
		if(!(`quantity` in product)){
			product.quantity = 1
		}
		if(!(`id` in product)){
			console.log(`Product needs an "id" property`)
		}
		this.contents.push(product)
		this.ulysses.triggerEventListeners(`cart.add`, product)
	}
	remove(product) {
		const productToRemove = this.getProduct(product)
		const index = this.contents.indexOf(productToRemove)
		if (index === -1) {
			console.error(`Product not found:`, productToRemove)
			return
		}
		this.contents.splice(index, 1)
	}
	clear() {
		this.contents.length = 0
		this.ulysses.triggerEventListeners(`cart.clear`)
	}
	getProduct(id){
		if(typeof id == `object`) return id
		for (let product of this.contents){
			if(product.id === id){
				return product
			}
		}
	}
}

export default pluginWrapper(Cart)