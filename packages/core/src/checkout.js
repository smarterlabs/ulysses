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

		this.ulysses.triggerEventListeners(`checkout.init`)
	}
	start(){
		this.ulysses.cart.close()

		// UI should respond to this event
		this.ulysses.triggerEventListeners(`checkout.start`)
	}
	addModification(mod){
		const modification = new this.ulysses.Modification(this.ulysses, mod)
		this.modifications.push(modification)
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
		this.ulysses.triggerEventListeners(`checkout.onRemoveModification`, toRemove)
	}
	calculateTotal(){

	}
	getModification(id) {
		if (typeof id == `object`) return id
		for (let mod of this.modifications) {
			if (mod.id === id) {
				return mod
			}
		}
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