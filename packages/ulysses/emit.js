export default async function emit({
	label,
	args,
	events,
}) {
	if (!events[label]) return
	const fns = events[label]
	for (let i = 0; i < fns.length; i++) {
		const result = await fns[i](...args)
		if (!result) return false
	}
	return true
}