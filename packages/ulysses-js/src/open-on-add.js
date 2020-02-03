import { pluginWrapper } from './index'

class OpenOnAdd {
	constructor(ulysses){
		ulysses.addEventListener(`cart.onAdd`, ulysses.cart.open)
	}
}

export default pluginWrapper(OpenOnAdd)