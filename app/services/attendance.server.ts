import type { IStorage } from "~/interfaces/storage";
import type { Attendance } from "~/schema/attendance";

export async function getAllAttendances(storage: IStorage<Attendance>, formId: string): Promise<Attendance[]> {
	const attendanceKeys = await storage.listKeys(formId);
	const attendances: (Attendance | null)[] = await Promise.all([
		...attendanceKeys.map(async (key) => {
			const attendance: Attendance | null = await storage.get(key);
			return attendance;
		}),
	]);
	return (attendances.filter((value) => value !== null) as Attendance[]) ?? [];
}

export async function pushAttendance(storage: IStorage<Attendance>, formId: string, attendance: Attendance) {
	await storage.set(`${formId}:${attendance.id}`, attendance, {
		ttl: 7 * 24 * 60 * 60, // 7 days
	});
}
