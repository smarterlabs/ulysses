const { Ulysses } = require(`../dist`)

test(`Exports a function`, () => {
	expect(typeof Ulysses).toBe(`function`)
})


test(`Cart can add products`, () => {
	const ulysses = new Ulysses()
	ulysses.cart.add({ id: 1 })
	expect(ulysses.cart.contents[0].id).toBe(1)
})

test(`User can add address`, () => {
	const ulysses = new Ulysses()
	ulysses.user.addAddress({ id: `test` })
	expect(ulysses.user.addresses[0].id).toBe(`test`)
})