import Papa from "papaparse";
import type { Attendance } from "~/schema/attendance";

export async function exportFormResultToCsv(attendances: Attendance[]) {
	const csv = Papa.unparse(attendances);
	return csv;
}
