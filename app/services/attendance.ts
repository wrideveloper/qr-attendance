import type { AttendanceForm } from "~/schema/attendance";
import { getMany, keys, set } from "idb-keyval";

export function createAttendanceForm(detail: AttendanceForm) {
	set(`attendance-${detail.id}`, detail);
}

export async function getAllAttendanceForms() {
	const storedKeys = await keys();
	const attendanceKeys = storedKeys.filter((key) => key.toString().startsWith("attendance-"));
	const attendanceForms = await getMany<AttendanceForm>(attendanceKeys);
	return attendanceForms.sort((a, b) => b.date.getTime() - a.date.getTime());
}
