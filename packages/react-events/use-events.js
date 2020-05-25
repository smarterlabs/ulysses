import { useContext } from 'react'
import Context from './context'

export default function useTest(){
	return useContext(Context)
}