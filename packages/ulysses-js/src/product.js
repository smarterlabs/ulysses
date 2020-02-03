import bindThis from './bind-this'

const productDataKeys = [
	`id`,
	`name`,
	`description`,
	`price`,
	`quantity`,
	`maximumQuantity`,
	`meta`,
]

export default class Product {
	constructor(ulysses, product) {
		if (!(`id` in product)) {
			console.error(`Product needs an "id" property`)
		}
		if(!(`price` in product)){
			product.price = 0
		}
		if(!(`quantity` in product)){
			product.quantity = 1
		}

		this.ulysses = ulysses
		for (let key of productDataKeys) {
			this[key] = product[key]
		}

		bindThis(this, [
			`remove`,
			`update`,
		])
	}
	async remove() {
		await this.ulysses.cart.remove(this)
	}
	async update(obj){
		for(let key in obj){
			if (productDataKeys.includes(key)) {
				this[key] = obj[key]
			}
		}
		await this.ulysses.cart.handleChange(`update`)
	}
	toObject(){
		const obj = {}
		for(let key of productDataKeys){
			if(this[key] !== undefined){
				obj[key] = this[key]
			}
		}
		return obj
	}
}