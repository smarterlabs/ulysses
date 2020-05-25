export function eventsReducer(oldEvents, { type, label, fn, cb }){

	// Add event
	if (type === `on`) {
		const events = { ...oldEvents }
		if (!events[label]) {
			events[label] = []
		}
		events[label].push(fn)
		return events
	}

	// Emit event
	if (type === `emit`) {
		if (!oldEvents[label]) {
			console.error(`Event label`, label, `not found`)
			return oldEvents
		}
		runEvents(oldEvents[label], cb)
		return oldEvents
	}
}

async function runEvents(events, cb){
	for(let i = 0; i < events.length; i++){
		await events[i]()
	}
	cb()
}

export function on(eventsDispatch, label, fn) {
	eventsDispatch({ label, fn, type: `on` })
}
export function emit(eventsDispatch, label) {
	return new Promise((resolve) => {
		eventsDispatch({ label, type: `emit`, cb: resolve })
	})
}