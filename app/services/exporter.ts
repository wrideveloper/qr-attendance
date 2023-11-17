import Papa from "papaparse";
import { getAttendances } from "./attendance";

export async function exportFormResultToCsv(formId: string) {
	const formAttendances = await getAttendances(formId);
	const csv = Papa.unparse(formAttendances);
	return csv;
}
