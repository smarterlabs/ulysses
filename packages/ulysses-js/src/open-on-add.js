import { pluginWrapper } from './index'

class OpenOnAdd {
	constructor(ulysses){
		ulysses.addEventListener(`cart.onChange`, ulysses.cart.open)
	}
}

export default pluginWrapper(OpenOnAdd)