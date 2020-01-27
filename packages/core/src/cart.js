import { pluginWrapper } from './index'

class Cart {
	constructor(ulysses, options){
		ulysses.cart = this
		this.ulysses = ulysses
		if(!(`Product` in this.ulysses)){
			this.ulysses.Product = Product
		}
		this.contents = options.contents || []
		this.isOpen = options.isOpen || false
		this.ulysses.triggerEventListeners(`cart.init`)
	}
	open(){
		this.isOpen = true
		this.ulysses.triggerEventListeners([`cart.open`, `cart.toggle`])
	}
	close() {
		this.isOpen = false
		this.ulysses.triggerEventListeners([`cart.close`, `cart.toggle`])
	}
	toggle() {
		this.isOpen = !this.isOpen
		this.ulysses.triggerEventListeners(`cart.toggle`)
	}
	add(product) {
		// Create copy so we don't alter the original for future adds
		product = {...product}

		// Correct quantity
		if(!(`quantity` in product)){
			product.quantity = 1
		}

		// Error if ID is missing
		if(!(`id` in product)){
			console.error(`Product needs an "id" property`)
		}

		// Check if product is already in cart
		const productInCart = this.getProduct(product.id)
		if(productInCart){
			product.quantity += productInCart.quantity
			const index = this.contents.indexOf(productInCart)
			this.contents[index] = product
		}
		else {
			this.contents.push(product)
		}

		// Limit quantity
		if (product.quantity > product.totalQuantity) {
			product.quantity = product.totalQuantity
		}

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

class Product {
	constructor(ulysses, product) {
		if (!(`id` in product)) {
			console.error(`Product needs an "id" property`)
		}

		this.ulysses = ulysses
		for (let key in product) {
			this[key] = product[key]
		}
	}
	remove() {
		this.ulysses.cart.remove(this)
	}
}

export default pluginWrapper(Cart)