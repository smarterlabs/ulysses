import { pluginWrapper } from './index'

class Checkout {
	constructor(ulysses, options) {
		// Set options
		for (let key in options) {
			this[key] = options[key]
		}

		ulysses.checkout = this
		this.ulysses = ulysses

		this.ulysses.triggerEventListeners(`checkout.init`)
	}
	start(){
		// UI should respond to this event
		this.ulysses.triggerEventListeners(`checkout.start`)
	}
	setBilling(){

	}
}

export default pluginWrapper(Checkout)