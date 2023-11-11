import { type LoaderFunctionArgs, json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { attendanceSchema } from "~/schema/attendance";
import { ATTENDANCE_GLOBAL_STORE, getAttendance, submitAttendance } from "~/services/attendance.server";
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
	const id = params.id;
	const uid = params.uid;

	if (id === undefined || uid === undefined) {
		return json({ error: "Bad Request" }, { status: 400 });
	}

	// If the attendanceId is present, then we've checked this already
	const query = new URLSearchParams(request.url.split("?")[1]);
	const attendanceId = query.get("attendanceId");
	if (attendanceId !== null) {
		return;
	}

	if (!ATTENDANCE_GLOBAL_STORE.has(id)) {
		return json({ error: "Not found" }, { status: 404 });
	}

	const currentValidNanoId = NANOID_GLOBAL_STORE.get(id);
	if (currentValidNanoId !== uid) {
		return json({ error: "Not found" }, { status: 404 });
	}

	const body = await request.json();
	const attendance = attendanceSchema.safeParse(body);

	if (!attendance.success) {
		return json({ error: "Bad Request" }, { status: 400 });
	}

	submitAttendance(attendance.data);

	return redirect(`/submit/${id}/${uid}?attendanceId=${attendance.data.id}`);
}
