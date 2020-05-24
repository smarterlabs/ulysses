import useUlysses from './use-ulysses'
import remove from 'lodash/remove'

export default function useOn(){
	const { events, setEvents } = useUlysses()

	function on(label, fn){
		if (!events) return
		console.log(`on`, label)
		const newEvents = { ...events }
		if (!newEvents[label]) {
			newEvents[label] = []
		}
		newEvents[label].push(fn)
		console.log(`Setting events`, newEvents)
		setEvents(newEvents)
		return () => {
			console.log(`off`)
			if (!events[label]) return
			const newEvents = { ...events }
			remove(newEvents[label], ef => ef === fn)
			setEvents(newEvents)
		}
	}

	return on
}