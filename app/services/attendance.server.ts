import type { Attendance } from "~/schema/attendance";

export const ATTENDANCE_GLOBAL_STORE = new Map<string, Attendance[]>();

export async function submitAttendance(attendance: Attendance) {
	const stored = ATTENDANCE_GLOBAL_STORE.get(attendance.id) ?? [];
	ATTENDANCE_GLOBAL_STORE.set(attendance.id, [...stored, attendance]);
}

export async function getAllAttendances(id: string) {
	return ATTENDANCE_GLOBAL_STORE.get(id) ?? [];
}
