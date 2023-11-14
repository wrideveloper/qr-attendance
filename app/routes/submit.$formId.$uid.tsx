import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { Link, useActionData } from "@remix-run/react";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { attendanceSchema } from "~/schema/attendance";
import { pushAttendance } from "~/services/attendance.server";
import { getCurrentValidUid } from "~/services/nanoid.server";

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
					<p
						className={cn(
							"text-3xl font-medium text-center",
							actionData.success ? "text-green-500" : "text-red-500"
						)}
					>
						{actionData.message}
					</p>
				</>
			) : (
				<span className="text-center">You shouldn't be here</span>
			)}
			<Link to="/">
				<Button>Back to Home</Button>
			</Link>
		</div>
	);
}

export async function action({ params, request, context }: ActionFunctionArgs) {
	const formId = params.formId;
	const uid = params.uid;

	if (formId === undefined || uid === undefined) {
		console.log("Form ID or UID can't be empty");
		return json({ success: false, message: "Bad Request" }, { status: 400 });
	}

	const currentValidNanoId = await getCurrentValidUid(context.NANOID_STORE as KVNamespace, formId);
	if (currentValidNanoId === null) {
		console.log(`Form ID ${formId} doesn't exist`);
		return json({ success: false, message: "Form ID doesn't exist" }, { status: 400 });
	}
	if (currentValidNanoId !== uid) {
		console.log(`Invalid UID, expected: ${currentValidNanoId}, actual: ${uid}`);
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

	await pushAttendance(context.ATTENDANCE_STORE as KVNamespace, formId, attendance.data);

	console.log(`Successfully submitted an attendance for formId: ${formId} | uid: ${uid}`);
	return json({ success: true, message: "Successfully submitted an attendance" });
}
