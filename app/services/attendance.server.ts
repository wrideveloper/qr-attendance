import type { Attendance } from "~/schema/attendance";

const GLOBAL_STORE = new Map<string, Attendance[]>();

export async function submitAttendance(attendance: Attendance) {
	const stored = GLOBAL_STORE.get(attendance.id) ?? [];
	GLOBAL_STORE.set(attendance.id, [...stored, attendance]);
}

export async function getAllAttendances(id: string) {
	return GLOBAL_STORE.get(id) ?? [];
}
