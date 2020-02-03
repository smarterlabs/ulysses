const formatter = new Intl.NumberFormat(`en-US`, {
	style: `currency`,
	currency: `USD`,
	minimumFractionDigits: 2,
})
export default function formatUsd(n){
	n = n / 100
	return formatter.format(n)
}