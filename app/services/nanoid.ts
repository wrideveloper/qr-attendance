import { nanoid } from "nanoid";

export const NANOID_GLOBAL_STORE = new Map<string, string>();

export function generateRandomNanoId(attendanceId: string) {
	const randomUid = nanoid();
	NANOID_GLOBAL_STORE.set(attendanceId, randomUid);
	return randomUid;
}
