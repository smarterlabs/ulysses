import { useContext } from 'react'
import Context from './context'

export default function useUlysses(){
	return useContext(Context)
}