import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { Link, useActionData } from "@remix-run/react";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { attendanceSchema } from "~/schema/attendance";
import { ATTENDANCE_QUEUE } from "~/services/attendance.server";
import { NANOID_GLOBAL_STORE } from "~/services/nanoid";

export default function SubmitResultPage() {
	const actionData = useActionData<typeof action>();

	return (
		<div className="flex flex-col items-center justify-center w-full h-full space-y-4">
			{actionData !== undefined ? (
				<>
					{actionData.success ? (
						<CheckCircleIcon className="w-20 h-20 text-green-500" />
					) : (
						<AlertCircleIcon className="w-20 h-20 text-red-500" />
					)}
					<p className={cn("text-3xl font-medium", actionData.success ? "text-green-500" : "text-red-500")}>
						{actionData.message}
					</p>
				</>
			) : (
				<span>You shouldn't be here</span>
			)}
			<Link to="/">
				<Button>Back to Home</Button>
			</Link>
		</div>
	);
}

export async function action({ params, request }: ActionFunctionArgs) {
	const formId = params.formId;
	const uid = params.uid;

	if (formId === undefined || uid === undefined) {
		console.log("Form ID or UID can't be empty");
		return json({ success: false, message: "Bad Request" }, { status: 400 });
	}

	const currentValidNanoId = NANOID_GLOBAL_STORE.get(formId);
	if (currentValidNanoId !== uid) {
		console.log("Invalid UID");
		return json({ success: false, message: "Invalid UID" }, { status: 400 });
	}

	const bodyForm = (await request.formData()) as FormData;
	const body = Object.fromEntries(bodyForm.entries());
	const attendance = attendanceSchema.safeParse({
		...body,
		time: new Date(body.time as string),
	});

	if (!attendance.success) {
		console.log("Invalid Attendance", attendance.error);
		return json({ success: false, message: "Invalid Attendance" }, { status: 400 });
	}

	let formAttendances = ATTENDANCE_QUEUE.get(formId);
	if (formAttendances === undefined) {
		ATTENDANCE_QUEUE.set(formId, []);
		formAttendances = [];
	}
	formAttendances = [...formAttendances, attendance.data];
	ATTENDANCE_QUEUE.set(formId, formAttendances);

	return json({ success: true, message: "Successfully submitted an attendance" });
}
