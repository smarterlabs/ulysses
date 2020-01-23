const Ulysses = require(`../dist`).default

test(`Exports a function`, () => {
	expect(typeof Ulysses).toBe(`function`)
})
test(`Cart can add products`, () => {
	const ulysses = new Ulysses()
	console.log(ulysses)
	ulysses.cart.add({ id: 1 })
	expect(ulysses.cart.contents[0].id).toBe(1)
})
