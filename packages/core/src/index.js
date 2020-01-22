import Cart from './cart'

export default class Ulysses{
	constructor(options = {}){
		const {
			noPlugins = false,
			plugins = [],
		} = options
		// Add default plugins
		if(noPlugins === false){
			plugins.unshift(
				new Cart(),
			)
		}

		// Attach plugins to class
		plugins.forEach(plugin => {
			this[plugin.id] = plugin
		})
	}
}