import type { Attendance } from "~/schema/attendance";

export const ATTENDANCE_GLOBAL_STORE = new Map<string, Attendance[]>();

export function submitAttendance(attendance: Attendance) {
	const stored = ATTENDANCE_GLOBAL_STORE.get(attendance.id) ?? [];
	ATTENDANCE_GLOBAL_STORE.set(attendance.id, [...stored, attendance]);
}

export function getAllAttendances(id: string) {
	return ATTENDANCE_GLOBAL_STORE.get(id) ?? [];
}

export async function getAttendance(formId: string, attendanceId: string) {
	const stored = ATTENDANCE_GLOBAL_STORE.get(formId) ?? [];
	return stored.find((attendance) => attendance.id === attendanceId);
}
