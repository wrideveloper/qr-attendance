import { nanoid } from "nanoid";

export async function generateRandomNanoId(kv: KVNamespace, formId: string) {
	const randomNanoId = nanoid();
	await kv.put(formId, randomNanoId);
	return `${formId}::${randomNanoId}`;
}

export function getCurrentValidUid(kv: KVNamespace, formId: string) {
	return kv.get(formId);
}
