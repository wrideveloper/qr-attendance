import Papa from "papaparse";
import type { Attendance } from "~/schema/attendance";

export async function exportFormResultToCsv(attendances: Attendance[]) {
	const csv = Papa.unparse(
		{
			fields: ["ID", "Full Name", "Class", "Study Program", "Feedback", "Time"],
			data: attendances.map((attendance) => [
				attendance.id,
				attendance.fullname,
				attendance.class,
				attendance.studyProgram,
				attendance.feedback,
				attendance.time,
			]),
		},
		{ header: true }
	);
	return csv;
}
