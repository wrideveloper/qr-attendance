import type { AttendanceForm } from "~/schema/attendance";
import { set } from "idb-keyval";

export function createAttendanceForm(detail: AttendanceForm) {
	set(`attendance-${detail.id}`, detail);
}
