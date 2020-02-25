import Cookies from 'js-cookie'
import { pluginWrapper } from './index'
import bindThis from './bind-this'
import Product from './product'

class Cart {
	constructor(ulysses, options){
		ulysses.cart = this
		this.ulysses = ulysses
		if(!(`Product` in this.ulysses)){
			this.ulysses.Product = Product
		}
		this.contents = options.contents || []
		this.isOpen = options.isOpen || false
		this.calculateTotals()
		this.loadState()
		this.ulysses.triggerEventListeners(`cart.onInit`)

		bindThis(this, [
			`open`,
			`close`,
			`toggle`,
			`add`,
			`remove`,
			`clear`,
			`handleChange`,
			`saveState`,
			`loadState`,
		])
	}
	getProduct(id) {
		if (typeof id == `object`) return id
		for (let product of this.contents) {
			if (product.id === id) {
				return product
			}
		}
	}
	calculateTotals() {
		let subtotal = 0
		let totalQuantity = 0
		for (let product of this.contents) {
			subtotal += product.price * product.quantity
			totalQuantity += product.quantity
		}
		this.subtotal = subtotal
		this.totalQuantity = totalQuantity
	}

	async open(){
		this.isOpen = true
		this.ulysses.triggerEventListeners([`cart.onOpen`, `cart.onToggle`])
	}
	async close() {
		this.isOpen = false
		this.ulysses.triggerEventListeners([`cart.onClose`, `cart.onToggle`])
	}
	async toggle() {
		this.isOpen = !this.isOpen
		this.ulysses.triggerEventListeners(`cart.onToggle`)
	}
	async add(products) {
		if(!Array.isArray(products)){
			products = [products]
		}
		for(let product of products){

			product = new Product(this.ulysses, product)

			// Correct quantity
			if (!(`quantity` in product)) {
				product.quantity = 1
			}


			// Check if product is already in cart
			const productInCart = this.getProduct(product.id)
			if (productInCart) {
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
		}

		this.ulysses.triggerEventListeners(`cart.onAdd`, products)
		await this.handleChange(`add`)
	}
	async remove(product) {
		const productToRemove = this.getProduct(product)
		const index = this.contents.indexOf(productToRemove)
		if (index === -1) {
			console.error(`Product not found:`, product)
			return
		}
		this.contents.splice(index, 1)
		this.ulysses.triggerEventListeners(`cart.onRemove`, productToRemove)
		await this.handleChange(`remove`)
	}
	async clear() {
		this.contents.length = 0
		this.ulysses.triggerEventListeners(`cart.onClear`)
		await this.handleChange(`clear`)
	}
	async handleChange(type) {
		this.calculateTotals()
		this.saveState()
		this.ulysses.triggerEventListeners(`cart.onChange`, this.contents, type)
	}

	toObject(){
		return this.contents.map(product => product.toObject())
	}
	saveState(){
		Cookies.set(`cart.contents`, JSON.stringify(this.toObject()))
	}
	loadState(contents){
		try {
			if (!contents) {
				contents = Cookies.get(`cart.contents`)
				contents = JSON.parse(contents)
			}
		}
		catch(err){
			console.error(err)
			return
		}
		this.add(contents)
	}
}

export default pluginWrapper(Cart)