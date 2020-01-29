import { pluginWrapper } from './index'

class Checkout {
	constructor(ulysses, options) {
		// Set options
		for (let key in options) {
			this[key] = options[key]
		}

		if(!(`Modification` in ulysses)){
			ulysses.Modification = Modification
		}

		ulysses.checkout = this
		this.ulysses = ulysses
		this.modifications = []
		this.shippingMethods = []
		this.calculateTotals()

		this.ulysses.triggerEventListeners(`checkout.onInit`)
	}
	start(){
		this.ulysses.cart.close()

		// UI should respond to this event
		this.ulysses.triggerEventListeners(`checkout.onStart`)
	}
	addModification(mod){
		const modification = new this.ulysses.Modification(this.ulysses, mod)
		this.modifications.push(modification)
		this.calculateTotals()
		this.ulysses.triggerEventListeners(`checkout.onAddModification`, modification)
		return modification
	}
	removeModification(modification) {
		const toRemove = this.getModification(modification)
		const index = this.modifications.indexOf(toRemove)
		if (index === -1) {
			console.error(`Modification not found:`, toRemove)
			return
		}
		this.modifications.splice(index, 1)
		this.calculateTotals()
		this.ulysses.triggerEventListeners(`checkout.onRemoveModification`, toRemove)
	}
	setTax(tax){
		this.taxTotal = tax
		this.calculateTotals()
		this.ulysses.triggerEventListeners(`checkout.onSetTax`)
	}
	calculateTotals(){
		this.subtotal = this.ulysses.cart.subtotal
		let total = this.subtotal
		if(`taxTotal` in this){
			total += this.taxTotal
		}
		if(`shippingTotal` in this){
			total += this.shippingTotal
		}
		for(let mod of this.modifications){
			if(typeof mod.value === `function`){
				total += mod.value(this.ulysses)
				continue
			}
			total += mod.value
		}
		this.total = total
	}
	getModification(id) {
		if (typeof id == `object`) return id
		for (let mod of this.modifications) {
			if (mod.id === id) {
				return mod
			}
		}
	}

	setShippingOptions(options){
		if(!Array.isArray(options)){
			options = [options]
		}
		this.shippingMethods.length = 0
		for(let group of options){
			this.shippingMethods.push(new ShippingMethodGroup(group))
		}
	}
	setShippingMethod(method){
		method = this.getShippingMethod(method)
		this.selectedShippingMethod = method
	}
	getShippingMethod(method) {
		if (typeof method == `object`) return method
		for (let item of this.shippingMethods) {
			if (item.id === method) {
				return item
			}
		}
	}
}

// const shippingOptions = [
// 	{
// 		name: `Product Group 1`,
// 		methods: [
// 			{
// 				name: `Express Shipping`,
// 				value: 200,
// 			},
// 		],
// 	},
// ]


class ShippingMethodGroup{
	constructor(ulysses, { methods, ...options }){
		for(let i in options){
			this[i] = options[i]
		}
		this.methods = []
		for(let method of methods){
			this.methods.push(new ShippingMethod(ulysses, this, method))
		}
		this.ulysses = ulysses
	}
	selectMethod(selected){
		for(let method of this.methods){
			if (selected === method){
				method.selected = true
			}
			else{
				method.selected = false
			}
		}
		this.ulysses.triggerEventListeners(`shipping.onShippingMethodChange`, selected)
	}
}
class ShippingMethod{
	constructor(ulysses, group, options) {
		for (let i in options) {
			this[i] = options[i]
		}
		this.ulysses = ulysses
		this.group = group
	}
	select(){
		this.group.selectMethod(this)
	}
}


class Modification{
	constructor(_, options = {}){
		for(let i in options){
			this[i] = options[i]
		}
	}
	remove() {
		this.ulysses.checkout.removeModification(this)
	}
}

export default pluginWrapper(Checkout)