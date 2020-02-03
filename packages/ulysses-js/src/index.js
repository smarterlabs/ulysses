import cloneDeep from 'clone-deep'
import cart from './cart'
import user from './user'
import checkout from './checkout'
import openOnAdd from './open-on-add'
import bindThis from './bind-this'

export class Ulysses{
	constructor({
		noPlugins = false,
		plugins = [],
		shared = {},
	} = {}) {
		this.eventListeners = {}
		this.eventHooks = {}
		this.setShared(shared)

		// Add default plugins
		if(noPlugins === false){
			plugins.unshift(
				cart(),
				user(),
				checkout(),
				openOnAdd(),
			)
		}

		// Attach plugins to class
		plugins.forEach(initPlugin => {
			initPlugin(this)
		})

		bindThis(this, [
			`setShared`,
			`addEventListener`,
			`removeEventListener`,
			`triggerEventListeners`,
		])
	}

	setShared(obj){
		this.shared = {
			...this.shared,
			...cloneDeep(obj),
		}
		this.triggerEventListeners(`onSetShared`, this.shared)
	}
	loadShared(obj){
		this.shared = cloneDeep(obj)
		this.triggerEventListeners(`onLoadShared`, this.shared)
	}

	// Event Listeners
	addEventListener(on, fn){
		this.createEventType(on)
		this.eventListeners[on].push(fn)
	}
	removeEventListener(on, fn) {
		this.createEventType(on)
		const index = this.eventListeners[on].indexOf(fn)
		if (index === -1) {
			console.error(`Event listener type not found:`, on)
			return
		}
		this.eventListeners[on].splice(index, 1)
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


	// Event hooks
	addEventHook(on, fn){
		this.createEventType(on)
		this.eventHooks[on].push(fn)
	}
	removeEventHook(on, fn) {
		this.createEventType(on)
		const index = this.eventHooks[on].indexOf(fn)
		if (index === -1) {
			console.error(`Event hook type not found:`, on)
			return
		}
		this.eventHooks[on].splice(index, 1)
	}
	async triggerEventHooks(label, ...args) {
		for(let hook in this.eventHooks[label]){
			await hook(...args)
		}
	}

	createEventType(label) {
		if (!this.eventListeners[label]) {
			this.eventListeners[label] = []
		}
		if (!this.eventHooks[label]) {
			this.eventHooks[label] = []
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