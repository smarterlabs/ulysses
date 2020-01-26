const { Ulysses } = require(`../dist`)

describe(`Cart toggle`, () => {
	const ulysses = new Ulysses()
	test(`Cart should be closed by default`, () => {
		expect(ulysses.cart.isOpen).toBe(false)
	})
	test(`Cart should open`, () => {
		ulysses.cart.open()
		expect(ulysses.cart.isOpen).toBe(true)
	})
	test(`Cart should close`, () => {
		ulysses.cart.close()
		expect(ulysses.cart.isOpen).toBe(false)
	})
	test(`Cart should toggle`, () => {
		ulysses.cart.toggle()
		expect(ulysses.cart.isOpen).toBe(true)
	})
})

describe(`Cart products`, () => {
	const ulysses = new Ulysses()
	const product = {
		id: 1,
		quantity: 3,
	}
	test(`Cart can add a product`, () => {
		ulysses.cart.add(product)
		expect(ulysses.cart.contents[0].id).toBe(1)
		expect(ulysses.cart.contents[0].quantity).toBe(3)
	})
	test(`Cart can remove a product by ID`, () => {
		ulysses.cart.remove(product.id)
		expect(ulysses.cart.contents.length).toBe(0)
	})
})

describe(`User addresses`, () => {
	const ulysses = new Ulysses()
	const address = { id: `addressTest` }

	test(`User can add an address`, () => {
		ulysses.user.addAddress(address)
		expect(ulysses.user.addresses[0].id).toBe(address.id)
	})
	test(`User can remove an address by ID`, () => {
		ulysses.user.removeAddress(address.id)
		expect(ulysses.user.addresses.length).toBe(0)
	})
})

describe(`User payment methods`, () => {
	const ulysses = new Ulysses()
	const paymentMethod = { id: `paymentMethodTest` }

	test(`User can add a payment method`, () => {
		ulysses.user.addPaymentMethod(paymentMethod)
		expect(ulysses.user.paymentMethods[0].id).toBe(paymentMethod.id)
	})
	test(`User can remove a payment method`, () => {
		ulysses.user.removePaymentMethod(paymentMethod.id)
		expect(ulysses.user.paymentMethods.length).toBe(0)
	})
})