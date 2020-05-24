import useUlysses from './context'

export default function useCheckout(){
	const { emit } = useUlysses()

	async function checkout(){
		await emit(`checkout`)
	}

	return checkout
}