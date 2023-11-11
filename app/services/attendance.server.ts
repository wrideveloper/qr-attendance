import type { Attendance } from "~/schema/attendance";

export const ATTENDANCE_QUEUE = new Map<string, Attendance[]>();

export async function getAllAttendances(formId: string) {
	return ATTENDANCE_QUEUE.get(formId) ?? [];
}
