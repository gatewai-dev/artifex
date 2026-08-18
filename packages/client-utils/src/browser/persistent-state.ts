import { useState } from "react";

export function usePersistentState<T>(key: string, initialValue: T) {
	const [state, setState] = useState<T>(() => {
		try {
			const item = localStorage.getItem(key);
			if (item === null) return initialValue;
			try {
				return JSON.parse(item) as T;
			} catch {
				return item as unknown as T;
			}
		} catch {
			return initialValue;
		}
	});

	const setPersistentState = (value: T | ((val: T) => T)) => {
		try {
			setState((prevState) => {
				const valueToStore =
					typeof value === "function"
						? (value as (val: T) => T)(prevState)
						: value;
				try {
					localStorage.setItem(key, JSON.stringify(valueToStore));
				} catch (error) {
					console.error(error);
				}
				return valueToStore;
			});
		} catch (error) {
			console.error(error);
		}
	};

	return [state, setPersistentState] as const;
}
