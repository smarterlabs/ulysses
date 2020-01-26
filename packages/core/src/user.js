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
	addAddress(obj){
		const address = new this.ulysses.Address(this.ulysses, obj)
		this.addresses.push(address)
		this.ulysses.triggerEventListeners(`user.addAddress`)
		return address
	}
	removeAddress(address) {
		const index = this.addresses.indexOf(address)
		if (index > -1) {
			this.addresses.splice(index, 1)
		}
		this.ulysses.triggerEventListeners(`user.removeAddress`)
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
	remove(){
		this.ulysses.user.removeAddress(this)
	}
}

export default pluginWrapper(User)