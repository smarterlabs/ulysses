import React from 'react'
import UlyssesProvider from '@smarterlabs/ulysses/provider'
import UlyssesPluginShopify from '@smarterlabs/ulysses-plugin-shopify'
import useUlysses from '@smarterlabs/ulysses/use-ulysses'

function UlyssesSandboxPage() {
	const {
		isLoading,
		addToCart,
		adjustQuantity,
		remove,
		checkout,
		totalQuantity,
		totalPrice,
		lineItems,
	} = useUlysses()

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
						disabled={isLoading ? true : false}
					>
						Add Apple to Cart
					</button>
					<button
						onClick={() => adjustQuantity(`APL`, -1)}
						disabled={isLoading ? true : false}
					>
						Subtract 1 Apple
					</button>
					<button
						onClick={() => remove(`APL`)}
						disabled={isLoading ? true : false}
					>
						Remove All Apples
					</button>
				</div>
				<div>
					<button
						onClick={() => addToCart({
							sku: `OBAMA`,
							shopifyId: `Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNDA0MTExMzczOTQwMA==`,
							title: `Orangebanan`,
							price: 15,
						})}
						disabled={isLoading ? true : false}
					>
						Add Orangebanan to Cart
					</button>
				</div>
				<div>
					<button
						onClick={() => checkout()}
					>Checkout</button>
				</div>
				<hr />



				<h3>Status:</h3>
				<div>
					<strong>Adding to Cart:</strong> {isLoading ? `true` : `false`}
				</div>
				<div>
					<strong>Total Quantity:</strong> {totalQuantity}
				</div>
				<div>
					<strong>Total Price:</strong> {totalPrice}
				</div>
				<hr />





				<h3>Line Items:</h3>
				<ul>
					{lineItems.map((item, key) => {
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
		<UlyssesProvider
			localStorageKey='asdfasdf'
		>
			<UlyssesPluginShopify
				client={{
					storefrontAccessToken: `1e5affc44fbe68334d8e2e5c07851d3f`,
					domain: `labs-boilerplate.myshopify.com`,
				}}
			/>
			<UlyssesSandboxPage />
		</UlyssesProvider>
	)
}