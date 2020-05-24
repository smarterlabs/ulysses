import React from 'react'
import UlyssesProvider from '@smarterlabs/ulysses/provider'
import UlyssesPluginShopify from '@smarterlabs/ulysses-plugin-shopify'
import useUlysses from '@smarterlabs/ulysses/use-ulysses'
import useAddToCart from '@smarterlabs/ulysses/use-add-to-cart'
import useUpdateQuantity from '@smarterlabs/ulysses/use-update-quantity'

function Page() {
	const ulysses = useUlysses()
	const addToCart = useAddToCart()
	const updateQuantity = useUpdateQuantity()

	return (
		<main>
			<section>
				<h1>Ulysses Sandbox</h1>
				<h3>Functions</h3>
				<div>
					<button onClick={() => addToCart({
						sku: `APL`,
						title: `Apple`,
						price: 50,
					})}>Add Apple to Cart</button>
					<button onClick={() => updateQuantity(`APL`, -1)}>Subtract 1 Apple</button>
				</div>
				<div>
					<button onClick={() => addToCart({
						sku: `OBAMA`,
						title: `Orangebanan`,
						price: 15,
					})}>Add Orangebanan to Cart</button>
				</div>
				<hr />



				<h3>Status:</h3>
				<div>
					<strong>Total Quantity:</strong> {ulysses.totalQuantity}
				</div>
				<div>
					<strong>Total Price:</strong> {ulysses.totalPrice}
				</div>
				<hr />





				<h3>Line Items:</h3>
				<ul>
					{ulysses.lineItems.map((item, key) => {
						return (
							<li key={key}><pre>{JSON.stringify(item, null, 3)}</pre></li>
						)
					})}
				</ul>
			</section>
		</main>
	)
}

export default function Layout(){
	return (
		<UlyssesProvider>
			<UlyssesPluginShopify client={{test:true}} />
			<Page />
		</UlyssesProvider>
	)
}