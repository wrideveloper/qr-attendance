import type { Attendance } from "~/schema/attendance";

export async function getAllAttendances(kv: KVNamespace, formId: string): Promise<Attendance[]> {
	const attendances: Attendance[] | null = await kv.get(formId, { type: "json" });
	return attendances ?? [];
}

export async function pushAttendance(kv: KVNamespace, formId: string, attendance: Attendance) {
	let formAttendances: Attendance[] | null = await kv.get(formId, { type: "json" });
	if (formAttendances === null) {
		kv.put(formId, JSON.stringify([]));
		formAttendances = [];
	}
	formAttendances = [...formAttendances, attendance];
	kv.put(formId, JSON.stringify(formAttendances));
}
