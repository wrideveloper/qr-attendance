import type { Attendance } from "~/schema/attendance";

export async function getAllAttendances(kv: KVNamespace, formId: string): Promise<Attendance[]> {
	const attendanceKeys = await kv.list({ prefix: formId });
	const attendances: (Attendance | null)[] = await Promise.all([
		...attendanceKeys.keys.map(async (key) => {
			const attendance: Attendance | null = await kv.get(key.name, { type: "json" });
			return attendance;
		}),
	]);
	return (attendances.filter((value) => value !== null) as Attendance[]) ?? [];
}

export async function pushAttendance(kv: KVNamespace, formId: string, attendance: Attendance) {
	await kv.put(`${formId}:${attendance.id}`, JSON.stringify(attendance), {
		expirationTtl: 24 * 60 * 60, // 24 hours
	});
}
