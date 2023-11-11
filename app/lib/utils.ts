import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function capitalise(text: string) {
	return text
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ");
}

export function createFormData(data: Record<string, any>) {
	const formData = new FormData();

	Object.keys(data).forEach((key) => {
		formData.append(key, data[key]);
	});

	return formData;
}
