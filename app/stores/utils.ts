import { atom } from "jotai";

export function atomWithLocalStorage<TData>(key: string, initialValue: TData) {
	const getInitialValue = () => {
		if (typeof window === "undefined") {
			return initialValue;
		}

		const item = localStorage.getItem(key);
		if (item !== null) {
			return JSON.parse(item);
		}
		return initialValue;
	};
	const baseAtom = atom<TData>(getInitialValue());
	const derivedAtom = atom(
		(get) => get(baseAtom),
		(get, set, update) => {
			const nextValue = typeof update === "function" ? update(get(baseAtom)) : update;
			// @ts-expect-error - ok to ignore since i don't want to deal with the type for now
			set(baseAtom, nextValue);
			if (typeof localStorage === "undefined") return;
			localStorage.setItem(key, JSON.stringify(nextValue));
		}
	);
	return derivedAtom;
}
