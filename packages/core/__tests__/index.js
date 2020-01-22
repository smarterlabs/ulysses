const preset = require(`../dist`).default

test(`exports a function`, () => {
	expect(typeof preset).toBe(`function`)
})
