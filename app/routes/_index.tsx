import type { MetaFunction } from "@remix-run/node";
import { CreateAttendanceFormDialog } from "~/components/attendance/create-attendance-dialog";

export const meta: MetaFunction = () => {
	return [{ title: "WRI QR Attendance" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
	return (
		<div className="h-full flex flex-col gap-4 items-center justify-center">
			<h1 className="text-2xl">WRI QR Attendance</h1>
			<CreateAttendanceFormDialog
				onCreate={(detail) => {
					console.log({ detail });
				}}
			/>
		</div>
	);
}
