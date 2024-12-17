import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

type TypeOut = {
	ref: React.RefObject<HTMLDivElement>; // Change to HTMLDivElement
	isShow: boolean
	setIsShow: Dispatch<SetStateAction<boolean>>
}

/**
 * A custom hook to detect clicks outside of a referenced element.
 * @param initialIsVisible - Initial visibility state.
 * @returns An object containing a ref, visibility state, and a function to set visibility state.
 */
export const useOutside = (initialIsVisible: boolean): TypeOut => {
	const [isShow, setIsShow] = useState(initialIsVisible)
	const ref = useRef<HTMLDivElement>(null); // Change to HTMLDivElement

	const handleClickOutside = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			setIsShow(false)
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true)

		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, []) // Added empty dependency array

	return { ref, isShow, setIsShow }
}
