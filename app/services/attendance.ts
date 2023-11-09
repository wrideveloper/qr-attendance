import type { Attendance, AttendanceForm } from "~/schema/attendance";
import { getMany, keys, set } from "idb-keyval";

export function createAttendanceForm(detail: AttendanceForm) {
	return set(`attendance-${detail.id}`, detail);
}

export async function getAllAttendanceForms() {
	const storedKeys = await keys();
	const attendanceKeys = storedKeys.filter((key) => key.toString().startsWith("attendance-"));
	const attendanceForms = await getMany<AttendanceForm>(attendanceKeys);
	return attendanceForms.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getAttendance(id: string) {
	return await getMany<AttendanceForm>([`attendance-${id}`]);
}

export function storeAttendances(id: string, attendances: Attendance[]) {
	return set(`attendance-${id}`, attendances);
}
