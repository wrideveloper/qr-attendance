import { nanoid } from "nanoid";

export const NANOID_GLOBAL_STORE = new Map<string, string>();

export function generateRandomNanoId(formId: string) {
	const randomNanoId = nanoid();
	const randomUid = `${formId}::${randomNanoId}`;
	NANOID_GLOBAL_STORE.set(formId, randomUid);
	return randomUid;
}
