import cart from './cart'
import user from './user'

export class Ulysses{
	constructor({
		noPlugins = false,
		plugins = [],
	} = {}) {
		this.eventListeners = {}

		// Add default plugins
		if(noPlugins === false){
			plugins.unshift(
				cart(),
				user(),
			)
		}

		// Attach plugins to class
		plugins.forEach(initPlugin => {
			initPlugin(this)
		})

	}

	addEventListener(on, fn){
		this.createEventType(on)
		this.eventListeners[on].push(fn)
	}
	removeEventListener(on, fn) {
		this.createEventType(on)
		const index = this.eventListeners[on].indexOf(fn)
		if (index == -1) {
			console.error(`Event listener type not found:`, on)
			return
		}
		this.eventListeners[on].splice(index, 1)
	}
	createEventType(label){
		if(this.eventListeners[label]) return
		this.eventListeners[label] = []
	}
	triggerEventListeners(labels, ...args) {
		if(!Array.isArray(labels)){
			labels = [labels]
		}
		for (let label of labels) {
			if (!this.eventListeners[label]) continue
			this.eventListeners[label].map(fn => fn(...args))
		}
	}
}

export function pluginWrapper(Plugin){
	return options => {
		return ulysses => {
			new Plugin(ulysses, {
				...options,
			})
		}
	}
}