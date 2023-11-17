import type { Attendance, AttendanceForm } from "~/schema/attendance";
import { del, get, getMany, keys, set } from "idb-keyval";

export function createAttendanceForm(form: AttendanceForm) {
	return set(`attendance-form-${form.id}`, form);
}

export function removeAttendanceForm(formId: string) {
	return del(`attendance-form-${formId}`);
}

export async function getAllAttendanceForms() {
	const storedKeys = await keys();
	const attendanceKeys = storedKeys.filter((key) => key.toString().startsWith("attendance-"));
	const attendanceForms = await getMany<AttendanceForm>(attendanceKeys);
	return attendanceForms.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getAttendances(formId: string): Promise<Attendance[]> {
	const attendances = await get(`attendance-${formId}`);
	return attendances ?? [];
}

export function storeAttendances(formId: string, attendances: Attendance[]) {
	return set(`attendance-${formId}`, attendances);
}
