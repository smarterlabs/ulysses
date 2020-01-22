export default class Cart {
	constructor({ contents = [] }) {
		this.contents = contents
	}
	add(product) {
		this.contents.push(product)
	}
	clear() {
		this.contents.length = 0
	}
}