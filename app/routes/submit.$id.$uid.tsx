import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { ATTENDANCE_GLOBAL_STORE } from "~/services/attendance.server";

export async function loader({ params }: LoaderFunctionArgs) {
	const id = params.id as string;

	if (!ATTENDANCE_GLOBAL_STORE.has(id)) {
		return json({ error: "Not found" }, { status: 404 });
	}

	return json({});
}

export default function SubmitPage() {
	return (
		<div>
			<h1>Submit</h1>
			<p>This is the submit page</p>
		</div>
	);
}
