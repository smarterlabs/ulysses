import cart from './cart'

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
			console.error(`Event listener type "${on}" not found`)
			return
		}
		this.eventListeners[on].splice(index, 1)
	}
	createEventType(label){
		if(this.eventListeners[label]) return
		this.eventListeners[label] = []
	}
	triggerEventListeners(label, ...args) {
		if (!this.eventListeners[label]) return
		this.eventListeners[label].map(fn => fn(...args))
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