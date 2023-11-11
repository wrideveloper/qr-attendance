import { json, type ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { attendanceSchema } from "~/schema/attendance";
import { ATTENDANCE_QUEUE } from "~/services/attendance.server";
import { NANOID_GLOBAL_STORE } from "~/services/nanoid";

export async function action({ params, request }: ActionFunctionArgs) {
	const formId = params.formId;
	const uid = params.uid;

	if (formId === undefined || uid === undefined) {
		console.log("Form ID or UID can't be empty");
		return json({ error: "Bad Request" }, { status: 400 });
	}

	const currentValidNanoId = NANOID_GLOBAL_STORE.get(formId);
	if (currentValidNanoId !== uid) {
		console.log("Invalid UID");
		return json({ error: "Invalid UID" }, { status: 400 });
	}

	const bodyForm = (await request.formData()) as FormData;
	const body = Object.fromEntries(bodyForm.entries());
	const attendance = attendanceSchema.safeParse({
		...body,
		time: new Date(body.time as string),
	});

	if (!attendance.success) {
		console.log("Invalid Attendance", attendance.error);
		return json({ error: "Invalid Attendance" }, { status: 400 });
	}

	let formAttendances = ATTENDANCE_QUEUE.get(formId);
	if (formAttendances === undefined) {
		ATTENDANCE_QUEUE.set(formId, []);
		formAttendances = [];
	}
	formAttendances = [...formAttendances, attendance.data];
	ATTENDANCE_QUEUE.set(formId, formAttendances);

	return redirect("/");
}
