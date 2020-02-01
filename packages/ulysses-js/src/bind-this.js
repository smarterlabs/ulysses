export default function bindThis($this, keys){
	for(let key of keys){
		$this[key] = $this[key].bind($this)
	}
}