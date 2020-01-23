import { pluginWrapper } from './index'

class Cart {
	constructor(ulysses, options){
		ulysses.cart = this
		this.ulysses = ulysses
		this.contents = options.contents || []
		this.ulysses.triggerEventListeners(`cart.init`)
	}
	add(product) {
		if(!(`quantity` in product)){
			product.quantity = 1
		}
		if(!(`id` in product)){
			console.log(`Product needs an "id" property`)
		}
		console.log(this.contents)
		this.contents.push(product)
		this.ulysses.triggerEventListeners(`cart.add`, product)
		this.ulysses.triggerEventListeners(`cart.onChange`, this.contents, `add`)
	}
	remove(product) {
		const productToRemove = this.getProduct(product)
		const index = this.contents.indexOf(productToRemove)
		if (index === -1) {
			console.error(`Product not found:`, productToRemove)
			return
		}
		this.contents.splice(index, 1)
		this.ulysses.triggerEventListeners(`cart.remove`, productToRemove)
		this.ulysses.triggerEventListeners(`cart.onChange`, this.contents, `remove`)
	}
	clear() {
		this.contents.length = 0
		this.ulysses.triggerEventListeners(`cart.clear`)
		this.ulysses.triggerEventListeners(`cart.onChange`, this.contents, `clear`)
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