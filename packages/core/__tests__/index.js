const { Ulysses } = require(`../dist`)

describe(`Cart toggle`, () => {
	let ulysses = new Ulysses()
	test(`Cart is closed by default`, () => {
		expect(ulysses.cart.isOpen).toBe(false)
	})
	test(`Cart can open`, () => {
		ulysses.cart.open()
		expect(ulysses.cart.isOpen).toBe(true)
	})
	test(`Cart can close`, () => {
		ulysses.cart.close()
		expect(ulysses.cart.isOpen).toBe(false)
	})
	test(`Cart can toggle`, () => {
		ulysses.cart.toggle()
		expect(ulysses.cart.isOpen).toBe(true)
	})
})

describe(`Cart products`, () => {
	let ulysses = new Ulysses()
	let product = {
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
	let ulysses = new Ulysses()
	let address = { id: `addressTest` }

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
	let ulysses = new Ulysses()
	let paymentMethod = { id: `paymentMethodTest` }

	test(`User can add a payment method`, () => {
		ulysses.user.addPaymentMethod(paymentMethod)
		expect(ulysses.user.paymentMethods[0].id).toBe(paymentMethod.id)
	})
	test(`User can remove a payment method`, () => {
		ulysses.user.removePaymentMethod(paymentMethod.id)
		expect(ulysses.user.paymentMethods.length).toBe(0)
	})
})

describe(`Cart events`, () => {
	let ulysses = new Ulysses()
	let ael = ulysses.addEventListener
	let product = { id: 1 }

	test(`cart.add triggers`, () => {
		let passed = false
		ael(`cart.add`, () => { passed = true })
		ulysses.cart.add(product)
		expect(passed).toBe(true)
	})
	test(`cart.remove triggers`, () => {
		let passed = false
		ael(`cart.remove`, () => { passed = true })
		ulysses.cart.add(product)
		ulysses.cart.remove(product.id)
		expect(passed).toBe(true)
	})
})