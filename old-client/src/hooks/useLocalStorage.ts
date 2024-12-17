import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface UseLocalStorage<T> {
	key: string;
	defaultValue: T;
}

/**
 * A custom hook that synchronizes a state variable with local storage.
 * @param key - The key under which the data is stored in local storage.
 * @param defaultValue - The default value to use if no data is found in local storage.
 * @returns An array containing the current value, a setter function, and a loading state.
 */
export function useLocalStorage<T>({
	defaultValue,
	key,
}: UseLocalStorage<T>): [T, Dispatch<SetStateAction<T>>, boolean] {
	const [isLoading, setIsLoading] = useState(true);
	const isMounted = useRef(false);
	const [value, setValue] = useState<T>(defaultValue);

	useEffect(() => {
		const loadFromLocalStorage = () => {
			try {
				if (typeof window !== "undefined") {
					// Перевірка на стороні клієнта
					const item = window.localStorage.getItem(key);
					if (item) {
						const parsedValue = JSON.parse(item);
						if (parsedValue) {
							setValue(parsedValue); // Тільки якщо дані валідні
						}
					}
				}
			} catch (error) {
				console.error(`Error reading localStorage key "${key}":`, error);
			} finally {
				setIsLoading(false);
			}
		};

		loadFromLocalStorage();
		isMounted.current = true; // Set as mounted after loading

		// Clean up effect
		return () => {
			isMounted.current = false; // Not really needed in this case
		};
	}, [key]);

	useEffect(() => {
		if (isMounted.current) {
			try {
				window.localStorage.setItem(key, JSON.stringify(value));
			} catch (error) {
				console.error(`Error setting localStorage key "${key}":`, error);
			}
		}
	}, [key, value]);

	return [value, setValue, isLoading];
}
