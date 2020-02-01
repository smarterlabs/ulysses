import { pluginWrapper } from './index'

const defaults = {
	firstName: ``,
	lastName: ``,
	email: ``,
}

class User {
	constructor(ulysses, options) {
		// Set options
		for (let key in options) {
			this[key] = options[key]
		}

		ulysses.user = this
		this.ulysses = ulysses
		if (!(`Address` in this.ulysses)){
			this.ulysses.Address = Address
		}
		if (!(`PaymentMethod` in this.ulysses)){
			this.ulysses.PaymentMethod = PaymentMethod
		}

		// Set defaults
		for(let key in defaults){
			if(key in this) continue
			this[key] = defaults[key]
		}
		if (!(`addresses` in this)) {
			this.addresses = []
		}
		if (!(`paymentMethods` in this)) {
			this.paymentMethods = []
		}

		this.ulysses.triggerEventListeners(`user.init`)
	}
	async addAddress(obj){
		const address = new this.ulysses.Address(this.ulysses, obj)
		this.addresses.push(address)
		this.ulysses.triggerEventListeners(`user.addAddress`)
		return address
	}
	async removeAddress(address) {
		address = this.getAddress(address)
		const index = this.addresses.indexOf(address)
		if (index > -1) {
			this.addresses.splice(index, 1)
		}
		this.ulysses.triggerEventListeners(`user.removeAddress`)
	}
	async addPaymentMethod(obj){
		const paymentMethod = new this.ulysses.PaymentMethod(this.ulysses, obj)
		this.paymentMethods.push(paymentMethod)
		this.ulysses.triggerEventListeners(`user.addPaymentMethod`)
		return paymentMethod
	}
	async removePaymentMethod(paymentMethod) {
		paymentMethod = this.getPaymentMethod(paymentMethod)
		const index = this.paymentMethods.indexOf(paymentMethod)
		if (index > -1) {
			this.paymentMethods.splice(index, 1)
		}
		this.ulysses.triggerEventListeners(`user.removePaymentMethod`)
	}
	getPaymentMethod(id) {
		if (typeof id == `object`) return id
		for (let method of this.paymentMethods) {
			if (method.id === id) {
				return method
			}
		}
	}
	getAddress(id) {
		if (typeof id == `object`) return id
		for (let address of this.addresses) {
			if (address.id === id) {
				return address
			}
		}
	}
}

class Address{
	constructor(ulysses, address){
		this.ulysses = ulysses
		this.addresses = ulysses.user.addresses
		for(let key in address){
			this[key] = address[key]
		}
	}
	async remove(){
		await this.ulysses.user.removeAddress(this)
	}
}
class PaymentMethod{
	constructor(ulysses, paymentMethod){
		this.ulysses = ulysses
		this.addresses = ulysses.user.paymentMethods
		for (let key in paymentMethod){
			this[key] = paymentMethod[key]
		}
	}
	async remove(){
		await this.ulysses.user.removePaymentMethod(this)
	}
}

export default pluginWrapper(User)