import type { Attendance, AttendanceForm } from "~/schema/attendance";
import { get, getMany, keys, set } from "idb-keyval";

export function createAttendanceForm(form: AttendanceForm) {
	return set(`attendance-form-${form.id}`, form);
}

export async function getAllAttendanceForms() {
	const storedKeys = await keys();
	const attendanceKeys = storedKeys.filter((key) => key.toString().startsWith("attendance-"));
	const attendanceForms = await getMany<AttendanceForm>(attendanceKeys);
	return attendanceForms.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getAttendances(formId: string) {
	return get(`attendance-${formId}`);
}

export function storeAttendances(formId: string, attendances: Attendance[]) {
	return set(`attendance-${formId}`, attendances);
}
