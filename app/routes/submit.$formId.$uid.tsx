import { type LoaderFunctionArgs, json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { attendanceSchema } from "~/schema/attendance";
import { ATTENDANCE_GLOBAL_STORE, getAttendance, storeAttendance } from "~/services/attendance.server";
import { NANOID_GLOBAL_STORE } from "~/services/nanoid";

export function loader({ params, request }: LoaderFunctionArgs) {
	const query = new URLSearchParams(request.url.split("?")[1]);
	const isAttendanceValid = getAttendance(params.id as string, query.get("attendanceId") as string);
	return json({ isAttendanceValid });
}

export default function SubmitPage() {
	return (
		<div>
			<h1>Submit</h1>
			<p>This is the submit page</p>
		</div>
	);
}

export async function action({ params, request }: ActionFunctionArgs) {
	const formId = params.formId;
	const uid = params.uid;

	console.log({ formId, uid });

	if (formId === undefined || uid === undefined) {
		return json({ error: "Bad Request" }, { status: 400 });
	}

	// If the attendanceId is present, then we've checked this already
	const query = new URLSearchParams(request.url.split("?")[1]);
	const attendanceId = query.get("attendanceId");
	if (attendanceId !== null) {
		return;
	}

	if (!ATTENDANCE_GLOBAL_STORE.has(formId)) {
		console.log("Attendance Form not found")
		return json({ error: "Not found" }, { status: 404 });
	}

	const currentValidNanoId = NANOID_GLOBAL_STORE.get(formId);
	if (currentValidNanoId !== uid) {
		console.log("UID not valid")
		return json({ error: "Not found" }, { status: 404 });
	}

	const body = await request.formData();
	const attendance = attendanceSchema.safeParse(body);

	if (!attendance.success) {
		console.log("Attendance not valid")
		return json({ error: "Bad Request" }, { status: 400 });
	}

	storeAttendance(attendance.data);

	return redirect(`/submit/${formId}/${uid}?attendanceId=${attendance.data.id}`);
}
