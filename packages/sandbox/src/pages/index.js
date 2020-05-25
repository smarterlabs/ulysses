import React from 'react'
import UlyssesProvider from '@smarterlabs/ulysses/provider'
import UlyssesPluginShopify from '@smarterlabs/ulysses-plugin-shopify'
import useUlysses from '@smarterlabs/ulysses/use-ulysses'

function UlyssesSandboxPage() {
	const ulysses = useUlysses()
	const { addToCart, adjustQuantity } = ulysses

	return (
		<main>
			<section>
				<h1>Ulysses Sandbox</h1>
				<h3>Functions</h3>
				<div>
					<button
						onClick={() => addToCart({
							sku: `APL`,
							shopifyId: `Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMzc3ODU5MDM1MTQ5Ng==`,
							title: `Apple`,
							price: 50,
						})}
						disabled={ulysses.isLoading ? true : false}
					>
						Add Apple to Cart
					</button>
					<button
						onClick={() => adjustQuantity(`APL`, -1)}
						disabled={ulysses.isLoading ? true : false}
					>
						Subtract 1 Apple
					</button>
				</div>
				<div>
					<button
						onClick={() => addToCart({
							sku: `OBAMA`,
							title: `Orangebanan`,
							price: 15,
						})}
						disabled={ulysses.isLoading ? true : false}
					>
						Add Orangebanan to Cart
					</button>
				</div>
				<hr />



				<h3>Status:</h3>
				<div>
					<strong>Adding to Cart:</strong> {ulysses.isLoading ? `true` : `false`}
				</div>
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
			<UlyssesPluginShopify
				clientOptions={{
					storefrontAccessToken: `1e5affc44fbe68334d8e2e5c07851d3f`,
					domain: `labs-boilerplate.myshopify.com`,
				}}
			/>
			<UlyssesSandboxPage />
		</UlyssesProvider>
	)
}